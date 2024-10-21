# Ansible Dynamic Assignments (Include) and Community Roles

In this project we will introduce (https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/tree/main/Ansible-Refactoring-and-Static-Assignments-Imports-and-Roles) by using `include module`.
We will continue configuring our `UAT servers`, learn and practice new Ansible concepts and modules.

### EC2 Instances for this project

Ansible server
UAT Web server 1
UAT Web server 2
Load balancer server
Load balancer security group inbound rule
Database server
![Screenshot 2024-10-21 123908](https://github.com/user-attachments/assets/df0ad41a-3331-415b-8fd7-0009fa28a2c0)
![Screenshot 2024-10-21 123917](https://github.com/user-attachments/assets/44e5c32e-cc3b-4433-ae3a-3947c380c24c)


From previous project (https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/tree/main/Ansible-Refactoring-and-Static-Assignments-Imports-and-Roles), we can already tell that static assignments use `import` Ansible module. The module that enables dynamic assignments is `include`.

Hence,
```bash
import = Static
include = Dynamic
```

When the `import` module is used, all statements are pre-processed at the time playbooks are parsed. Meaning, when you execute `site.yml` playbook, Ansible will process all the playbooks referenced during the time it is parsing the statements. This also means that, during actual execution, if any statement changes, such statements will not be considered. Hence, it is `static`.
On the other hand, when `include` module is used, all statements are processed only during execution of the playbook. Meaning, after the statements are parsed, any changes to the statements encountered during execution will be used.

Take note that in most cases it is recommended to use `static assignments` for playbooks, because it is more reliable. With `dynamic` ones, it is hard to debug playbook problems due to its dynamic nature. However, you can use dynamic assignments for environment specific variables as we will be introducing in this project.


## Introducing Dynamic Assignment Into Our structure

In your `https://github.com/<your-name>/ansible-config-mgt` GitHub repository start a new branch and call it `dynamic-assignments`.

```bash
git checkout -b dynamic-assignments
```

Create a new folder, name it `dynamic-assignments`.
Then inside this folder, create a new file and name it `env-vars.yml`. We will instruct `site.yml` to `include` this playbook later. For now, let us keep building up the structure.

```bash
mkdir dynamic-assignments
touch dynamic-assignments/env-vars.yml
```
![Screenshot 2024-10-20 043844](https://github.com/user-attachments/assets/7d5c8eb7-2cba-4315-a69f-7ac263f2bf67)
![Screenshot 2024-10-20 042934](https://github.com/user-attachments/assets/3c7c0c7a-1fa5-41e7-be05-16fedeb3b4c3)

Your GitHub shall have following structure by now.

__Note__: Depending on what method you used in the previous project you may have or not have `roles` folder in your GitHub repository - if you used `ansible-galaxy`, then `roles` directory was only created on your `Jenkins-Ansible` server locally. It is recommended to have all the codes managed and tracked in GitHub, so you might want to recreate this structure manually in this case - it is up to you.

```css
├── dynamic-assignments
│   └── env-vars.yml
├── inventory
│   └── dev
    └── stage
    └── uat
    └── prod
└── playbooks
    └── site.yml
└── roles (optional folder)
    └──...(optional subfolders & files)
└── static-assignments
    └── common.yml
```

Since we will be using the same Ansible to configure multiple environments, and each of these environments will have certain unique attributes, such as `servername`, `ip-address` etc., we will need a way to set values to variables per specific environment.

For this reason, we will now create a folder to keep each environment's variables file. Therefore, create a new folder `env-vars`, then for each environment, create new `YAML` files which we will use to set variables.

```bash
mkdir env-vars

touch env-vars/dev.yml env-vars/stage.yml env-vars/uat.yml env-vars/prod.yml
```
![Screenshot 2024-10-20 044610](https://github.com/user-attachments/assets/a7e15ce1-80b8-4193-85ad-757cd678514a)

Your layout should now look like this.

```css
├── dynamic-assignments
│   └── env-vars.yml
├── env-vars
    └── dev.yml
    └── stage.yml
    └── uat.yml
    └── prod.yml
├── inventory
    └── dev
    └── stage
    └── uat
    └── prod
├── playbooks
    └── site.yml
└── static-assignments
    └── common.yml
    └── webservers.yml
```

Now paste the instruction below into the `env-vars.yml` file.

```yaml
---
- name: looping through list of available files
  include_vars: "{{ item }}"
  with_first_found:
    - files:
        - dev.yml
        - stage.yml
        - prod.yml
        - uat.yml
      paths:
        - "{{ playbook_dir }}/../env-vars"
  tags:
    - always
```

![Screenshot 2024-10-20 044622](https://github.com/user-attachments/assets/3f42345e-be5e-4a91-9a69-a4d1f2613fe9)

Notice 3 things to notice here:

1. We used `include_vars` syntax instead of `include`, this is because Ansible developers decided to separate different features of the module. From Ansible version 2.8, the `include` module is deprecated and variants of `include_*` must be used. These are:

- [include_role](https://docs.ansible.com/ansible/latest/collections/ansible/builtin/include_role_module.html#include-role-module)
- [include_tasks](https://docs.ansible.com/ansible/latest/collections/ansible/builtin/include_tasks_module.html#include-tasks-module)
- [include_vars](https://docs.ansible.com/ansible/latest/collections/ansible/builtin/include_vars_module.html#include-vars-module)

In the same version, variants of `import` were also introduces, such as:

- [import_role](https://docs.ansible.com/ansible/latest/collections/ansible/builtin/import_role_module.html#import-role-module)
- [import_tasks](https://docs.ansible.com/ansible/latest/collections/ansible/builtin/import_tasks_module.html#import-tasks-module)

2. We made use of a [special variables](https://docs.ansible.com/ansible/latest/reference_appendices/special_variables.html) `{{ playbook_dir }}` and `{{ inventory_file }}`. `{{ playbook_dir }}` will help Ansible to determine the location of the running playbook, and from there navigate to other path on the filesystem. `{{ inventory_file }}` on the other hand will dynamically resolve to the name of the inventory file being used, then append `.yml` so that it picks up the required file within the `env-vars` folder.

3. We are including the variables using a loop. `with_first_found` implies that, looping through the list of files, the first one found is used. This is good so that we can always set default values in case an environment specific env file does not exist.


## Update `site.yml` with dynamic assignments

Update `site.yml` file to make use of the dynamic assignment. (At this point, we cannot test it yet. We are just setting the stage for what is yet to come. So hang on to your hats)

`site.yml` should now look like this.

```yaml
---
- hosts: all
  name: Include dynamic variables
  become: yes
  tasks:
    - include_tasks: ../dynamic-assignments/env-vars.yml
      tags:
        - always

- import_playbook: ../static-assignments/common.yml

- import_playbook: ../static-assignments/uat-webservers.yml

- import_playbook: ../static-assignments/loadbalancers.yml
```
![Screenshot 2024-10-20 044957](https://github.com/user-attachments/assets/ef701e9d-f136-4257-b58c-f015d2c6ff97)
![Screenshot 2024-10-20 045517](https://github.com/user-attachments/assets/9b0b3831-c356-480b-ac8f-856251de94c5)
![Screenshot 2024-10-20 045528](https://github.com/user-attachments/assets/baa213cf-a7c5-46d1-bc04-8ef1959d8d9b)

## Community Roles

Now it is time to create a role for `MySQL` database - it should install the `MySQL` package, create a database and configure users. But why should we re-invent the wheel? There are tons of roles that have already been developed by other open source engineers out there. These roles are actually production ready, and dynamic to accomodate most of Linux flavours. With Ansible Galaxy again, we can simply download a ready to use ansible role, and keep going.

## Download Mysql Ansible Role

You can browse available community roles [here](https://galaxy.ansible.com/ui/)
We will be using a [MySQL role developed by geerlingguy](https://galaxy.ansible.com/ui/standalone/roles/geerlingguy/mysql/).

__Hint__: To preserve your your GitHub in actual state after you install a new role - make a commit and push to master your `ansible-config-mgt` directory. Of course you must have `git` installed and configured on `Jenkins-Ansible` server and, for more convenient work with codes, you can configure `Visual Studio Code to work with this directory`. In this case, you will no longer need webhook and Jenkins jobs to update your codes on `Jenkins-Ansible` server, so you can disable it - we will be using Jenkins later for a better purpose.

### Configure vscode to work with the directory (`ansible-config-mgt`)
On `Jenkins-Ansible` server make sure that `git` is installed with `git --version`, then go to `ansible-config-mgt` directory and run

```bash
git init
git pull https://github.com/<your-name>/ansible-config-mgt.git
git remote add origin https://github.com/<your-name>/ansible-config-mgt.git
git branch roles-feature
git switch roles-feature
```

### Inside `roles` directory create your new `MySQL role` with `ansible-galaxy` install `geerlingguy.mysql`

```bash
ansible-galaxy role install geerlingguy.mysql
```
![Screenshot 2024-10-20 050305](https://github.com/user-attachments/assets/26b364a5-1dce-4154-b70c-32cea3bd5662)
![Screenshot 2024-10-20 050432](https://github.com/user-attachments/assets/86b737e3-36e3-4fb2-95cc-921d49a4106e)

__Rename the folder to `mysql`__

```bash
mv geerlingguy.mysql/ mysql
```
![Screenshot 2024-10-20 051125](https://github.com/user-attachments/assets/fa3f373b-5167-4cb2-9363-6dcef900d47e)
![Screenshot 2024-10-20 051228](https://github.com/user-attachments/assets/69683123-bd63-4bc1-87db-ccbd89b8b937)
