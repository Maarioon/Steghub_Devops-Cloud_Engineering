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

Read README.md file, and edit roles configuration to use correct credentials for MySQL required for the tooling website.

### Create Database and mysql user (`roles/mysql/vars/main.yml`)

```yaml
mysql_root_password: ""
mysql_databases:
  - name: tooling
    encoding: utf8
    collation: utf8_general_ci
mysql_users:
  - name: webaccess
    host: "172.31.32.0/20" # Webserver subnet cidr
    password: Admin123
    priv: "tooling.*:ALL"
```
![Screenshot 2024-10-20 052039](https://github.com/user-attachments/assets/b06eaddc-ff18-4e2c-ae6b-2424890e8a38)

### Create a new playbook inside `static-assignments` folder and name it `db-servers.yml` , update it with `mysql` roles.

```yaml
- hosts: db_servers
  become: yes
  vars_files:
    - vars/main.yml
  roles:
    - { role: mysql }
```
![Screenshot 2024-10-20 045528](https://github.com/user-attachments/assets/d9862069-6b5c-43c3-a12b-7908ceaf60dc)


### Now it is time to upload the changes into your GitHub:

```bash
git add .
git commit -m "Commit new role files into GitHub"
git push --set-upstream origin roles-feature
```

### Now, if you are satisfied with your codes, you can create a Pull Request.

### Merge it to `main` branch on GitHub
![Screenshot 2024-10-20 050447](https://github.com/user-attachments/assets/51eaf5db-44c3-4ad8-8cb9-25b4258cd093)
![Screenshot 2024-10-20 050610](https://github.com/user-attachments/assets/4dc5f62b-e041-4773-8613-4e2319bf94be)
![Screenshot 2024-10-20 051116](https://github.com/user-attachments/assets/409e6be7-acf8-4b98-9608-192da227843e)
![Screenshot 2024-10-20 052456](https://github.com/user-attachments/assets/44219405-32c8-4d7e-bccd-1ed97dd389ba)
![Screenshot 2024-10-20 052541](https://github.com/user-attachments/assets/9dc6b29c-a0b1-4f67-ac0f-e12527a0c8ff)
![Screenshot 2024-10-20 052614](https://github.com/user-attachments/assets/1260c087-248e-4df7-86dd-38a0e902cdca)
![Screenshot 2024-10-20 052630](https://github.com/user-attachments/assets/2aa0785e-37f2-409c-94f2-a197bbbd5a2b)
![Screenshot 2024-10-20 052648](https://github.com/user-attachments/assets/31519ddb-2a12-4ab4-8d7a-5076e0b1e9ca)

# Load Balancer roles

We want to be able to choose which Load Balancer to use, `Nginx` or `Apache`, so we need to have two roles respectively:

1. Nginx
2. Apache

With your experience on Ansible so far you can:

- Decide if you want to develop your own roles, or find available ones from the community

### Using the Community

```bash
ansible-galaxy role install geerlingguy.nginx

ansible-galaxy role install geerlingguy.apache
```

### Rename the installed Nginx and Apache roles

```bash
mv geerlingguy.nginx nginx

mv geerlingguy.apache apache
```

### The folder structure now looks like this
![Screenshot 2024-10-20 055218](https://github.com/user-attachments/assets/e7fe4bcd-6204-4be7-89ee-ae30b05d9796)
![Screenshot 2024-10-20 055249](https://github.com/user-attachments/assets/ac9a66f7-390b-4d3b-853b-b5764afa33e5)
![Screenshot 2024-10-20 054452](https://github.com/user-attachments/assets/7dffcecf-a89a-446f-9449-a3b2402b8a62)


- ### Update both static-assignment and site.yml files to refer the roles

__Important Hints:__

- Since you cannot use both `Nginx` and `Apache` load balancer, you need to add a condition to enable either one - this is where you can make use of variables.
- Declare a variable in `defaults/main.yml` file inside the `Nginx` and `Apache` roles. Name each variables `enable_nginx_lb` and `enable_apache_lb` respectively.
- Set both values to `false` like this `enable_nginx_lb: false` and `enable_apache_lb: false`.
- Declare another variable in both roles `load_balancer_is_required` and set its value to `false` as well

### For nginx

```yaml
# roles/nginx/defaults/main.yml
enable_nginx_lb: false
load_balancer_is_required: false
```


### For apache

```yaml
# roles/apache/defaults/main.yml
enable_apache_lb: false
load_balancer_is_required: false
```


### Update assignment

`loadbalancers.yml` file

```yaml
---
- hosts: lb
  become: yes
  roles:
    - role: nginx
      when: enable_nginx_lb | bool and load_balancer_is_required | bool
    - role: apache
      when: enable_apache_lb | bool and load_balancer_is_required | bool
```
![Screenshot 2024-10-20 055635](https://github.com/user-attachments/assets/962b4e65-6e00-48e3-891e-82cba7d3cf66)
![Screenshot 2024-10-20 060002](https://github.com/user-attachments/assets/9166941a-33b3-4013-937a-caaa2a61f4ee)

- ### Update `site.yml` files respectively

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


- import_playbook: ../static-assignments/db-servers.yml
```

Now you can make use of `env-vars\uat.yml` file to define which `loadbalancer` to use in UAT environment by setting respective environmental variable to `true`.

You will activate `load balancer`, and enable `nginx` by setting these in the respective environment's `env-vars` file.

### Enable Nginx

```yaml
enable_nginx_lb: true
load_balancer_is_required: true
```

# Set up for Nginx Load Balancer

### Update `roles/nginx/defaults/main.yml`

__Configure Nginx virtual host__

```yaml
---
nginx_vhosts:
  - listen: "80"
    server_name: "example.com"
    root: "/var/www/html"
    index: "index.php index.html index.htm"
    locations:
              - path: "/"
                proxy_pass: "http://myapp1"

    # Properties that are only added if defined:
    server_name_redirect: "www.example.com"
    error_page: ""
    access_log: ""
    error_log: ""
    extra_parameters: ""
    template: "{{ nginx_vhost_template }}"
    state: "present"

nginx_upstreams:
- name: myapp1
  strategy: "ip_hash"
  keepalive: 16
  servers:
    - "172.31.35.223 weight=5"
    - "172.31.34.101 weight=5"

nginx_log_format: |-
  '$remote_addr - $remote_user [$time_local] "$request" '
  '$status $body_bytes_sent "$http_referer" '
  '"$http_user_agent" "$http_x_forwarded_for"'
become: yes
```

![Screenshot 2024-10-21 101443](https://github.com/user-attachments/assets/ff6aa47a-6ec7-4ad5-8bd6-3cfe947c64ce)
![Screenshot 2024-10-21 101733](https://github.com/user-attachments/assets/360996c5-3ee6-4a6d-8c35-85fb773631a4)
![Screenshot 2024-10-21 101739](https://github.com/user-attachments/assets/9163ff88-08db-445b-b7b2-9a0fa648295c)
![Screenshot 2024-10-21 101045](https://github.com/user-attachments/assets/3ce487f5-9cac-4450-8a22-18122be55739)
![Screenshot 2024-10-21 101434](https://github.com/user-attachments/assets/d8e4de6c-93f4-4873-8d81-b4d70293065b)

### Update `inventory/uat`

```yaml
[lb]
load_balancer ansible_host=172.31.6.105 ansible_ssh_user='ubuntu'

[uat_webservers]
Web1 ansible_host=172.31.35.223 ansible_ssh_user='ec2-user'
Web2 ansible_host=172.31.34.101 ansible_ssh_user='ec2-user'

[db_servers]
db ansible_host=172.31.2.161 ansible_ssh_user='ubuntu'
```

change  
![Screenshot 2024-10-21 101045](https://github.com/user-attachments/assets/6207998e-622a-41e6-97e0-5b47828912ce)
![Screenshot 2024-10-21 101434](https://github.com/user-attachments/assets/4d3e5cb4-db48-484e-b444-aa9d31098cc4)
![Screenshot 2024-10-21 101035](https://github.com/user-attachments/assets/7fc39767-3ae0-4f67-8ec6-a501e1e98bbd)

### Now run the playbook against your uat inventory

```bash
ansible-playbook -i inventory/uat playbooks/site.yml --extra-vars "@env-vars/uat.yml"
```
![Screenshot 2024-10-21 102831](https://github.com/user-attachments/assets/08c67f3a-9f67-4d66-bbc3-020812152cac)
![Screenshot 2024-10-21 102805](https://github.com/user-attachments/assets/ad2836a3-d0b5-4a95-bb7d-a01fb0fbc2a1)

if you're having issues loading the playbook, check all your  code and enable nnginx and loadbalancers where necessary, and where include is remove host and  use include_playbook, make sure you properly indent and check foor all necessary or skipped error, if properly fixed, it should run, the final look is above but i will include some off the places i made corrections for mine to run.

![Screenshot 2024-10-21 101434](https://github.com/user-attachments/assets/08f81b40-0221-45b4-a692-cbe57175c8cb)
![Screenshot 2024-10-21 101443](https://github.com/user-attachments/assets/40a12912-b910-4bb5-b544-ae912a73cc28)
![Screenshot 2024-10-21 101733](https://github.com/user-attachments/assets/e99388c8-0da0-4491-ad4b-c601caeb127e)
![Screenshot 2024-10-21 101739](https://github.com/user-attachments/assets/a2deb96b-b9e3-48ce-b460-eefc576c6dc4)
![Screenshot 2024-10-21 101010](https://github.com/user-attachments/assets/d897cb81-d9f0-40f7-a88b-b8d54af5c49a)
![Screenshot 2024-10-21 101035](https://github.com/user-attachments/assets/b11cd445-eab1-45f7-b378-c2eae04beb33)
![Screenshot 2024-10-21 101045](https://github.com/user-attachments/assets/a6eeb159-30c5-4fba-b325-5726d1df8e7e)
it is important to fix all errors.
