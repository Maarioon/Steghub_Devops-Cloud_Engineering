![Screenshot 2024-10-15 195434](https://github.com/user-attachments/assets/8fa047c5-1bca-421c-a69f-c89a8a439cb7)![Screenshot 2024-10-15 195352](https://github.com/user-attachments/assets/62c3b532-52d4-4713-ac1d-145eda46bf33)# Ansible Refactoring and Static Assignments, Imports, and Roles

This project involves the refactoring of Ansible playbooks and the use of static assignments, imports, and roles. It demonstrates how to effectively structure an Ansible project for better maintainability, reuse, and scalability.

## Project Structure

The project has been organized into several directories:
├── ansible.cfg ├── inventory │ ├── dev.yml │ ├── uat.yml ├── playbooks │ ├── site.yml │ ├── install_wireshark.yml ├── roles │ ├── common │ │ ├── tasks │ │ └── handlers │ └── uat-webservers │ ├── tasks │ └── handlers ├── static-assignments │ ├── common.yml │ └── uat-webservers.yml

 we will continue working with ansible-config-mgt repository and make some improvements of our code. Now we need to refactor our Ansible code, create assignments, and learn how to use the imports functionality. Imports allow to effectively re-use previously created playbooks in a new playbook - it allows us to organize our tasks and reuse them when needed.


## Step 1 - Jenkins job enhancement

Before we begin, let us make some changes to our Jenkins job - now every new change in the codes creates a separate directory which is not very convenient when we want to run some commands from one place. Besides, it consumes space on Jenkins serves with each subsequent change. Let us enhance it by introducing a new Jenkins project/job - we will require `Copy Artifact` plugin.

1. Go to your `Jenkins-Ansible` server and create a new directory called `ansible-config-artifact` - we will store there all artifacts after each build.

```bash
sudo mkdir /home/ubuntu/ansible-config-artifact
```

2. Change permissions to this directory, so Jenkins could save files there

```bash
chmod -R 0777 /home/ubuntu/ansible-config-artifact
```

3. Go to Jenkins web console -> Manage Jenkins -> Manage Plugins -> on Available tab search for `Copy Artifact` and install this plugin without restarting Jenkins
![Screenshot 2024-10-14 063014](https://github.com/user-attachments/assets/73383110-4f20-464d-9308-3fffb684cd7a)
![Screenshot 2024-10-14 063100](https://github.com/user-attachments/assets/da07ad30-134a-4798-824a-48e8e5e48ffd)
![Screenshot 2024-10-14 063834](https://github.com/user-attachments/assets/d169cfc4-5b87-4fdc-9943-845c29d56d05)
![Screenshot 2024-10-14 062807](https://github.com/user-attachments/assets/d6e751e9-ec44-43ba-90ea-a09e67afb913)
![Screenshot 2024-10-14 062851](https://github.com/user-attachments/assets/29b8ed5e-05e4-44e9-8941-0c6912073140)

4. Create a new Freestyle project and name it `save_artifacts`.

   To create a new Freestyle project in Jenkins named save_artifacts that gets triggered by the completion of your existing Ansible project, follow these steps:

Step 1: Log into Jenkins
Open your web browser and navigate to your Jenkins server (e.g., http://<your-jenkins-server>:8080).
Log in with your Jenkins credentials.
Step 2: Create a New Freestyle Project
Create a New Project:
On the Jenkins dashboard, click on "New Item" or "New".
In the "Enter an item name" field, type save_artifacts.
Select "Freestyle project" and click "OK".
Step 3: Configure the Project
General Configuration:

You can provide a description for the project in the "Description" field to help others understand its purpose.
Build Triggers:

Scroll down to the "Build Triggers" section.
Check the box for "Build after other projects are built."
In the "Projects to watch" field, enter the name of your existing Ansible project that you want to trigger this job. Make sure to specify it exactly as it is named in Jenkins.
Build Environment (if needed):

You can check the box for "Delete workspace before build starts" if you want to ensure that each build starts with a clean slate.
Step 4: Add Build Steps
Add Build Steps:

Scroll down to the "Build" section.
Click on "Add build step".
Depending on your requirement, select a suitable option like:
"Execute shell": If you want to run shell commands.
"Copy Artifact": If you need to copy artifacts from another build.
"Archive the artifacts": If you want to archive certain files or directories produced by previous builds.
For example, if you're archiving artifacts:

Select "Archive the artifacts".
In the "Files to archive" field, specify the files or patterns you want to save. For instance, you can use **/*.zip or **/*.tar.gz to archive all zip or tar.gz files.
Post-Build Actions (Optional):

If you want to take additional actions after the build, such as notifying another system or sending emails, you can configure them in the "Post-build Actions" section.
Step 5: Save the Configuration
After configuring the project, click the "Save" button at the bottom of the page.
Step 6: Test the Trigger
Trigger your existing Ansible project to ensure it completes successfully.
Once the Ansible project finishes, check the save_artifacts job to see if it runs as expected. You can also view the build history and logs to confirm that the artifacts were saved correctly.

![Screenshot 2024-10-14 093451](https://github.com/user-attachments/assets/e1683e55-fae0-44e2-bb40-a2face2b9217)


5. This project will be triggered by completion of your existing ansible project. Configure it accordingly

__Note:__ You can configure number of builds to keep in order to save space on the server, for example, you might want to keep only last 2 or 5 build results. You can also make this change to your ansible job.

6. The main idea of `save_artifacts` project is to save artifacts into `/home/ubuntu/ansible-config-artifact` directory. To achieve this, create a `Build` step and choose `Copy artifacts from other project`, specify `ansible` as a source project and `/home/ubuntu/ansible-config-artifact` as a target directory.
![Screenshot 2024-10-15 153116](https://github.com/user-attachments/assets/1a6c1672-0d01-4b52-8851-83b4c3061877)

7. Test your set up by making some change in README.MD file inside your `ansible-config-mgt` repository (right inside main branch).
![Screenshot 2024-10-16 063747](https://github.com/user-attachments/assets/bc1aebe0-8705-477b-aa12-4891b2f08ea2)

Remove the line - Testing jenkins build
![Screenshot 2024-10-15 153116](https://github.com/user-attachments/assets/d1bfbe22-f6d4-4b2c-9213-0aca5b6fe65f)


If both Jenkins jobs have completed one after another - you shall see your files inside `/home/ubuntu/ansible-config-artifact` directory and it will be updated with every commit to your master branch.
Now your Jenkins pipeline is more neat and clear


If you see an error lik ethis
```
Running as SYSTEM
Building in workspace /var/lib/jenkins/workspace/save_artifacts
FATAL: /home/ubuntu/ansible-config-artifact
java.nio.file.AccessDeniedException: /home/ubuntu/ansible-config-artifact
	at java.base/sun.nio.fs.UnixException.translateToIOException(UnixException.java:90)
	at java.base/sun.nio.fs.UnixException.rethrowAsIOException(UnixException.java:106)
	at java.base/sun.nio.fs.UnixException.rethrowAsIOException(UnixException.java:111)
	at java.base/sun.nio.fs.UnixFileSystemProvider.createDirectory(UnixFileSystemProvider.java:438)
	at java.base/java.nio.file.Files.createDirectory(Files.java:699)
	at java.base/java.nio.file.Files.createAndCheckIsDirectory(Files.java:807)
	at java.base/java.nio.file.Files.createDirectories(Files.java:793)
	at hudson.FilePath.mkdirs(FilePath.java:3753)
	at hudson.FilePath$Mkdirs.invoke(FilePath.java:1419)
	at hudson.FilePath$Mkdirs.invoke(FilePath.java:1414)
	at hudson.FilePath.act(FilePath.java:1235)
	at hudson.FilePath.act(FilePath.java:1218)
	at hudson.FilePath.mkdirs(FilePath.java:1409)
	at PluginClassLoader for copyartifact//hudson.plugins.copyartifact.CopyArtifact.copy(CopyArtifact.java:715)
	at PluginClassLoader for copyartifact//hudson.plugins.copyartifact.CopyArtifact.perform(CopyArtifact.java:679)
	at PluginClassLoader for copyartifact//hudson.plugins.copyartifact.CopyArtifact.perform(CopyArtifact.java:563)
	at jenkins.tasks.SimpleBuildStep.perform(SimpleBuildStep.java:123)
	at hudson.tasks.BuildStepCompatibilityLayer.perform(BuildStepCompatibilityLayer.java:80)
	at hudson.tasks.BuildStepMonitor$1.perform(BuildStepMonitor.java:20)
	at hudson.model.AbstractBuild$AbstractBuildExecution.perform(AbstractBuild.java:818)
	at hudson.model.Build$BuildExecution.build(Build.java:199)
	at hudson.model.Build$BuildExecution.doRun(Build.java:164)
	at hudson.model.AbstractBuild$AbstractBuildExecution.run(AbstractBuild.java:526)
	at hudson.model.Run.execute(Run.java:1894)
	at hudson.model.FreeStyleBuild.run(FreeStyleBuild.java:44)
	at hudson.model.ResourceController.execute(ResourceController.java:101)
	at hudson.model.Executor.run(Executor.java:446)
Finished: FAILURE
```

The error indicates that Jenkins doesn't have the necessary permissions to write to the directory /home/ubuntu/ansible-config-artifact. Specifically, it's an AccessDeniedException, meaning Jenkins is being blocked from creating or accessing the directory.

To resolve this, follow these steps:
1. Give Jenkins Access to the Directory
Change the ownership of the /home/ubuntu/ansible-config-artifact directory to the Jenkins user:

Copy code
```
sudo chown -R jenkins:jenkins /home/ubuntu/ansible-config-artifact
```
This command will make the Jenkins user the owner of the directory, allowing it to write files there.

Then, modify the permissions to allow Jenkins to read and write to the directory:

```
Copy code
sudo chmod -R 755 /home/ubuntu/ansible-config-artifact
```
This command sets read, write, and execute permissions for the owner (Jenkins) and read/execute permissions for others.

2. Verify Permissions
Run the following command to check the permissions of the directory and ensure that Jenkins has access:
```bash
Copy code
ls -ld /home/ubuntu/ansible-config-artifact
```
You should see that the directory is owned by jenkins:jenkins and has the appropriate permissions.

3. Rebuild the Jenkins Job
Once the permissions have been fixed, go back to Jenkins and rebuild the save_artifacts job.
The job should now be able to copy artifacts to the /home/ubuntu/ansible-config-artifact directory without permission errors.


![Screenshot 2024-10-14 093451](https://github.com/user-attachments/assets/de47d203-150f-46b1-b3c1-82577b5aafc5)


## Step 2 - Refactor Ansible code by importing other playbooks into `site.yml`

Before starting to refactor the codes, ensure that you have pulled down the latest code from master (main) branch, and create a new branch, name it refactor.

![Screenshot 2024-10-15 154420](https://github.com/user-attachments/assets/8c2267fe-c604-4397-801d-db0c343720c9)
![Screenshot 2024-10-15 154426](https://github.com/user-attachments/assets/3897f4c8-0734-49f1-8515-4b2a64093ad6)


`DevOps` philosophy implies constant iterative improvement for better efficiency - refactoring is one of the techniques that can be used, but you always have an answer to question "why?". Why do we need to change something if it works well?

In previous project, you wrote all tasks in a single playbook common.yml, now it is pretty simple set of instructions for only 2 types of `OS`, but imagine you have many more tasks and you need to apply this playbook to other servers with different requirements.
In this case, you will have to read through the whole playbook to check if all tasks written there are applicable and is there anything that you need to add for certain `server/OS` families. Very fast it will become a tedious exercise and your playbook will become messy with many commented parts. Your DevOps colleagues will not appreciate such organization of your codes and it will be difficult for them to use your playbook.

Let see code re-use in action by importing other playbooks.

1. Within `playbooks` folder, create a new file and name it `site.yml` - This file will now be considered as an entry point into the entire infrastructure configuration. Other playbooks will be included here as a reference. In other words, `site.yml` will become a parent to all other playbooks that will be developed. Including common.yml that you created previously.

2. Create a new folder in root of the repository and name it `static-assignments`. The __static-assignments__ folder is where all other children playbooks will be stored. This is merely for easy organization of your work. It is not an Ansible specific concept, therefore you can choose how you want to organize your work. You will see why the folder name has a prefix of __static__ very soon. For now, just follow along.

3. Move `common.yml` file into the newly created `static-assignments` folder.
![Screenshot 2024-10-15 154734](https://github.com/user-attachments/assets/4de480c3-8bcf-46ac-8dfa-430b5e7eae0c)

4. Inside `site.yml` file, import `common.yml` playbook.

```yaml
---
- hosts: all
- import_playbook: ../static-assignments/common.yml
```
![Screenshot 2024-10-15 155220](https://github.com/user-attachments/assets/cddb2dc8-a7bb-4fa3-9a9a-a7ab2460a64e)

The code above uses built in `import_playbook` Ansible module.

Your folder structure should look like this;

```css
├── static-assignments
│   └── common.yml
├── inventory
    └── dev
    └── stage
    └── uat
    └── prod
└── playbooks
    └── site.yml
```

__5. Run `ansible-playbook` command against the `dev` environment__

Since you need to apply some tasks to your `dev` servers and `wireshark` is already installed - you can go ahead and create another playbook under `static-assignments` and name it `common-del.yml`.

![Screenshot 2024-10-15 160323](https://github.com/user-attachments/assets/2f8f15c5-7d85-47bf-be1f-8d315f884664)

In this playbook, configure deletion of `wireshark` utility.

```yaml
---
- name: update web, nfs and db servers
  hosts: webservers, nfs, db
  remote_user: ec2-user
  become: yes
  become_user: root
  tasks:
  - name: delete wireshark
    yum:
      name: wireshark
      state: removed

- name: update LB server
  hosts: lb
  remote_user: ubuntu
  become: yes
  become_user: root
  tasks:
  - name: delete wireshark
    apt:
      name: wireshark
      state: absent
      autoremove: yes
      purge: yes
      autoclean: yes
```


![Screenshot 2024-10-15 160535](https://github.com/user-attachments/assets/1eb37c36-bc78-4b04-a5f2-9e66df36cff4)

__Update `site.yml` with `- import_playbook: ../static-assignments/common-del.yml` instead of `common.yml`__

```yaml
---
- hosts: all
- import_playbook: ../static-assignments/common-del.yml
```
![Screenshot 2024-10-15 161115](https://github.com/user-attachments/assets/9b193824-8f17-4d29-b97a-b3f4647bed35)


__Run it against dev servers__

```bash
cd /home/ubuntu/ansible-config-mgt/

ansible-playbook -i inventory/dev.yml playbooks/site.yaml
```
![Screenshot 2024-10-15 163635](https://github.com/user-attachments/assets/fec4d5d2-88da-4e3c-a027-035a357e4399)
![Screenshot 2024-10-15 163708](https://github.com/user-attachments/assets/55bf7ec2-39c2-41a2-a45d-721617e90213)

Now you have learned how to use import_playbooks module and you have a ready solution to install/delete packages on multiple servers with just one command.

## Step 3 - Configure UAT Webservers with a role `Webserver`

We have our nice and clean dev environment, so let us put it aside and configure 2 new Web Servers as uat. We could write tasks to configure Web Servers in the same playbook, but it would be too messy, instead, we will use a dedicated role to make our configuration reusable.

1. Launch 2 fresh EC2 instances using RHEL 9 image, we will use them as our uat servers, so give them names accordingly - `Web1-UAT` and `Web2-UAT`.

2. To create a role, you must create a directory called `roles/`, relative to the playbook file or in `/etc/ansible/` directory.

There are two ways how you can create this folder structure:

Use an Ansible utility called ansible-galaxy inside `ansible-config-mgt/roles` directory (you need to create `roles` directory upfront)

```basb
mkdir roles
cd roles
ansible-galaxy init webserver
```

![Screenshot 2024-10-15 165115](https://github.com/user-attachments/assets/96e6c704-686e-4417-abc9-461ce67cc97e)


__Note__: You can choose either way, but since you store all your codes in GitHub, it is recommended to create folders and files there rather than locally on `Jenkins-Ansible` server.

The entire folder structure should look like below, but if you create it manually - you can skip creating `tests`, `files`, and `vars` or remove them if you used `ansible-galaxy`

![](./images/ansible-galaxy.png)

```css
└── webserver
    ├── README.md
    ├── defaults
    │   └── main.yml
    ├── files
    ├── handlers
    │   └── main.yml
    ├── meta
    │   └── main.yml
    ├── tasks
    │   └── main.yml
    ├── templates
    ├── tests
    │   ├── inventory
    │   └── test.yml
    └── vars
        └── main.yml
```
After removing unnecessary directories and files, the roles structure should look like this

```css
└── webserver
    ├── README.md
    ├── defaults
    │   └── main.yml
    ├── handlers
    │   └── main.yml
    ├── meta
    │   └── main.yml
    ├── tasks
    │   └── main.yml
    └── templates
```
![Screenshot 2024-10-15 173352](https://github.com/user-attachments/assets/98bdb47a-d69f-4515-9fe0-89791ddd65b3)
![Screenshot 2024-10-15 171327](https://github.com/user-attachments/assets/9a2c093c-f567-4b8b-8342-87c62603fe96)


3. Update your inventory `ansible-config-mgt/inventory/uat.yml` file with IP addresses of your 2 `UAT Web servers`

__NOTE:__ Ensure you are using ssh-agent to ssh into the `Jenkins-Ansible` instance

```yaml
[uat-webservers]
<Web1-UAT-Server-Private-IP-Address> ansible_ssh_user='ec2-user'
<Web2-UAT-Server-Private-IP-Address> ansible_ssh_user='ec2-user'
```

To learn how to setup SSH agent and connect VS Code to your Jenkins-Ansible instance, please see this video:

- For Windows users - [ssh-agent on windows](https://www.youtube.com/watch?v=TYyTXxVWOYA)
- For Linux users - [ssh-agent on linux](https://www.youtube.com/watch?v=EoLrCX1VVog)


4. In /etc/ansible/ansible.cfg file uncomment roles_path string and provide a full path to your roles directory roles_path = /home/ubuntu/ansible-config-mgt/roles, so Ansible could know where to find configured roles.

![Screenshot 2024-10-15 162740](https://github.com/user-attachments/assets/67ff0b54-2421-40a3-8afb-6a68d9b83adc)


5. It is time to start adding some logic to the webserver role. Go into `tasks` directory, and within the `main.yml` file, start writing configuration tasks to do the following:

- Install and configure Apache (httpd service)
- Clone Tooling website from GitHub https://github.com/<your-name>/tooling.git.
- Ensure the tooling website code is deployed to /var/www/html on each of 2 UAT Web servers.
- Make sure httpd service is started

Your main.yml consist of following tasks:

```yaml
# tasks file for webserver
---
- name: install apache
  remote_user: ec2-user
  become: true
  become_user: root
  ansible.builtin.yum:
    name: "httpd"
    state: present

- name: install git
  remote_user: ec2-user
  become: true
  become_user: root
  ansible.builtin.yum:
    name: "git"
    state: present

- name: clone a repo
  remote_user: ec2-user
  become: true
  become_user: root
  ansible.builtin.git:
    repo: https://github.com/francdomain/tooling.git
    dest: /var/www/html
    force: yes

- name: copy html content to one level up
  remote_user: ec2-user
  become: true
  become_user: root
  command: cp -r /var/www/html/html/ /var/www/

- name: Start service httpd, if not started
  remote_user: ec2-user
  become: true
  become_user: root
  ansible.builtin.service:
    name: httpd
    state: started

- name: recursively remove /var/www/html/html/ directory
  remote_user: ec2-user
  become: true
  become_user: root
  ansible.builtin.file:
    path: /var/www/html/html
    state: absent
```

![Screenshot 2024-10-15 162740](https://github.com/user-attachments/assets/814ea82d-e8b7-4ac8-a44c-1224107d7f9d)
![Screenshot 2024-10-15 163616](https://github.com/user-attachments/assets/c8f164aa-dd78-42b6-be3f-f397b9fa3da6)
![Screenshot 2024-10-15 161200](https://github.com/user-attachments/assets/db853e12-666c-4efd-81c3-33d1d86d4b68)
![Screenshot 2024-10-15 161305](https://github.com/user-attachments/assets/aec97635-af31-4801-9c3f-ea0a2c38617f)
![Screenshot 2024-10-15 162203](https://github.com/user-attachments/assets/41ee6434-cf79-4fc6-966c-4331736b0656)
![Screenshot 2024-10-15 162220](https://github.com/user-attachments/assets/14798a20-203f-4eb6-ace9-43d8770901ae)

![Screenshot 2024-10-15 163616](https://github.com/user-attachments/assets/01472e99-2d7a-4ed6-8a64-30601f823d91)
![Screenshot 2024-10-15 190043](https://github.com/user-attachments/assets/6487b959-ab16-4adb-adec-522e2ec6c8e1)

## Step 4 - Reference `Webserver` role

Within the static-assignments folder, create a new assignment for uat-webservers `uat-webservers.yml`. This is where you will reference the role.

```yaml
---
- hosts: uat-webservers
  roles:
     - webserver
```
![Screenshot 2024-10-15 190050](https://github.com/user-attachments/assets/67251c57-48a4-4d0f-807e-d9e12f92583f)
![Screenshot 2024-10-15 162740](https://github.com/user-attachments/assets/7e7432ba-0933-4a1c-8ea8-8a996a1cd65f)
![Screenshot 2024-10-15 190746](https://github.com/user-attachments/assets/e946a6a6-99f9-4ac6-9769-fd9855770ff3)


Remember that the entry point to our ansible configuration is the site.yml file. Therefore, you need to refer your `uat-webservers.yml` role inside `site.yml`.

So, we should have this in `site.yml`

```yaml
---
- hosts: all
- import_playbook: ../static-assignments/common.yml

- hosts: uat-webservers
- import_playbook: ../static-assignments/uat-webservers.yml
```

![Screenshot 2024-10-15 190914](https://github.com/user-attachments/assets/59ab731c-3a5f-49f9-a925-ecbada8b842e)
![Screenshot 2024-10-15 190050](https://github.com/user-attachments/assets/16f9a2a4-6a6f-4a83-a763-be45856d6eb3)
![Screenshot 2024-10-15 190746](https://github.com/user-attachments/assets/3166b629-2cdc-4861-87be-2d5f8734236d)

## Step 5 - Commit & Test

Commit your changes, create a Pull Request and `main` them to master branch, make sure webhook triggered two consequent Jenkins jobs, they ran successfully and copied all the files to your `Jenkins-Ansible` server into `/home/ubuntu/ansible-config-artifact/` directory.


![Screenshot 2024-10-15 191614](https://github.com/user-attachments/assets/6aac9d6b-32a2-4e5a-ae76-fdb50e2b1ee6)
![Screenshot 2024-10-15 195409](https://github.com/user-attachments/assets/3b7ae805-0e6b-4aec-9b93-bbe8cd554c20)

Now run the playbook against your uat inventory and see what happens:

__NOTE:__ Before running your playbook, ensure you have tunneled into your Jenkins-Ansible server via ssh-agent For windows users, see this [video](https://www.youtube.com/watch?v=TYyTXxVWOYA) For [Linux] users, see this [video](https://www.youtube.com/watch?v=EoLrCX1VVog)

```bash
cd /home/ubuntu/ansible-config-artifact

ansible-playbook -i /inventory/uat.yml playbooks/site.yaml
```
![Screenshot 2024-10-15 195600](https://github.com/user-attachments/assets/8fd9a48c-7467-4feb-ab50-d9e0c9ecc3f4)
![Screenshot 2024-10-15 195608](https://github.com/user-attachments/assets/cd705188-f738-4680-94c1-dd949e6395b5)

You should be able to see both of your UAT Web servers configured and you can try to reach them from your browser:

```html
http://<Web1-UAT-Server-Public-IP-or-Public-DNS-Name>/index.php

or

http://<Web1-UAT-Server-Public-IP-or-Public-DNS-Name>/index.php
```
![Screenshot 2024-10-15 192527](https://github.com/user-attachments/assets/1d4b396a-e181-4aaa-b700-5a9e416e02ca)
![Screenshot 2024-10-15 192535](https://github.com/user-attachments/assets/38022ca6-a05e-4ece-848e-cc4556b3c399)
![Screenshot 2024-10-15 192549](https://github.com/user-attachments/assets/6a4a469a-bf71-4443-a364-a06534c55748)

In case you are having error cloning your git repo

The error you're encountering indicates that the Ansible task to clone a Git repository is failing because the specified URL is incorrect or inaccessible. Specifically, it states that the URL https://github.com/<your-name>/tooling.git returned a 400 error, which typically means there’s an issue with the request itself.

Steps to Resolve the Git Clone Issue
Update the Git Repository URL:

Make sure to replace <your-name> with your actual GitHub username in the Ansible playbook. For example:
```yaml
- name: Clone a repo
  become: true
  ansible.builtin.git:
    repo: https://github.com/your-actual-username/tooling.git  # Update this line
    dest: /var/www/html
    force: yes
```
Check Repository Accessibility:

Public Repository: If the repository is public, ensure that the URL is correct and that the repository exists.
Private Repository: If the repository is private, you will need to provide authentication:
Using HTTPS: You may use a personal access token. The format would be:
```yaml
- name: Clone a repo
  become: true
  ansible.builtin.git:
    repo: https://<username>:<token>@github.com/your-actual-username/tooling.git
    dest: /var/www/html
    force: yes
```
Replace <username> with your GitHub username and <token> with your personal access token.
Test the URL Manually:

Before running the Ansible playbook, try to manually clone the repository on the server to ensure that the URL is correct and that you have access. You can SSH into the server and run:
```bash
git clone https://github.com/your-actual-username/tooling.git
```
If you receive an error, it may provide more information about the nature of the problem.
Verify Your SSH Key (if applicable):

If you plan to use SSH for cloning instead, ensure that the server has access to your SSH key. Update the URL in the playbook to use SSH format:
```yaml
- name: Clone a repo
  become: true
  ansible.builtin.git:
    repo: git@github.com:your-actual-username/tooling.git  # SSH format
    dest: /var/www/html
    force: yes
```
After Making Changes:
Save your changes to the playbook.
Run the Ansible playbook again:
```bash
ansible-playbook -i inventory/uat.yml /home/ubuntu/ansible-config-mgt/uat_playbook.yml
```
__Access Web1-UAT__

![Screenshot 2024-10-15 195719](https://github.com/user-attachments/assets/bbe04cda-30ed-497a-bec8-e93e839018d6)

__Access Web2-UAT__

![Screenshot 2024-10-15 195751](https://github.com/user-attachments/assets/b8c20430-d9e6-44d8-98e3-323be709b38a)

__Our Ansible architecture now looks like this:__
![Screenshot 2024-10-15 191831](https://github.com/user-attachments/assets/e8e0ece6-e89b-4a4f-8628-5c86a2ff3ffe)

