
# ANSIBLE CONFIGURATION MANAGEMENT (AUTOMATE PROJECT 7 TO 10)

In Projects 7 to 10 we perform a lot of manual operations to set up virtual servers, install and configure required software and deploy our web application.

This Project will make us appreciate `DevOps tools` even more by making most of the routine tasks automated with [Ansible Configuration Management](https://www.redhat.com/en/topics/automation/what-is-configuration-management#:~:text=Configuration%20management%20is%20a%20process,in%20a%20desired%2C%20consistent%20state.&text=Managing%20IT%20system%20configurations%20involves,building%20and%20maintaining%20those%20systems.), at the same time we will become confident with writing code using declarative languages such as YAML.

## Ansible Client as a Jump Server (Bastion Host)

A `Jump Server` (sometimes also referred as `Bastion Host`) is an intermediary server through which access to internal network can be provided. If you think about the current architecture you are working on, ideally, the webservers would be inside a secured network which cannot be reached directly from the Internet. That means, even DevOps engineers cannot SSH into the Web servers directly and can only access it through a Jump Server - it provides better security and reduces attack surface.

## Task

- Install and configure Ansible client to act as a Jump Server/Bastion Host
- Create a simple Ansible playbook to automate servers configuration

On the diagram below the Virtual Private Network (VPC) is divided into two subnets - Public subnet has public IP addresses and Private subnet is only reachable by private IP addresses.

## Step 1 - Install and Configure ANSIBLE ON EC2 Instance

### 1. Update `Name` tag on your Jenkins EC2 Instance to `Jenkins-Ansible`. We will use this server to run playbooks.
![Screenshot 2024-10-10 043221](https://github.com/user-attachments/assets/9fb72762-d438-41b2-aafb-4188602040fd)

### 2. In your GitHub account create a new repository and name it ansible-config-mgt

### 3. Instal Ansible ([See: install ansible with pip](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html#installing-ansible-with-pip))

```bash
sudo apt update
```
![Screenshot 2024-10-10 043330](https://github.com/user-attachments/assets/5ccc3e16-1e28-45af-8a49-b37fc4bf7003)


```bash
sudo apt install ansible
```

![Screenshot 2024-10-10 050645](https://github.com/user-attachments/assets/c5811e08-9a5a-403f-bed0-5a175d731722)
__Check your ansible version__

```bash
ansible --version
```
![Screenshot 2024-10-10 052058](https://github.com/user-attachments/assets/cbbdb575-265f-4ffb-aa4c-2205a501a9ae)


### 4. Configure Jenkins build job to save your repository content every time you change it – this will solidify your Jenkins configuration skills acquired in Project 9

- Configure a Webhook in GitHub and set the webhook to trigger `ansible` build.
On `ansible-config-mgt` repository, select Settings > Webhooks > Add webhook
![Screenshot 2024-10-10 152842](https://github.com/user-attachments/assets/ae60126a-fdb7-44b5-9f30-92edca55b0b1)

- Create a new Freestyle project `ansible` in Jenkins

![Screenshot 2024-10-10 160255](https://github.com/user-attachments/assets/c992a995-1ad0-43c2-97b7-19271c7e7248)
![Screenshot 2024-10-10 160525](https://github.com/user-attachments/assets/cba9f24b-9298-4f31-ad42-d457a1654c2a)

- Point it to the `ansible-config-mgt` repository
Copy the repository URL
![Screenshot 2024-10-10 160146](https://github.com/user-attachments/assets/2f2023dd-ffe2-4f49-b077-7de5650b8f62)


In configuration of our `ansible` freestyle project choose `Git`, provide there the link to our `ansible-config-mgt` GitHub repository and credentials (user/password) so Jenkins could access files in the repository.

![Screenshot 2024-10-10 161123](https://github.com/user-attachments/assets/5b6b68b9-ce22-453a-ad03-9a28747489ff)


- Configure a Post-build job to save all (**) files, like ![Screenshot 2024-10-10 161156](https://github.com/user-attachments/assets/ec53d6c9-9993-4ef7-b01b-3cb24d9e0e1f)
you did it in [Project 9]


### 5. Test your setup by making some change in README.MD file in `master` branch and make sure that builds starts automatically and Jenkins saves the files (build artifacts) in following folder


Check `ansible` project on jenkins for the build

![Screenshot 2024-10-10 161123](https://github.com/user-attachments/assets/87fd0e44-0f03-4755-9628-fd1559973c44)


Console output

![Screenshot 2024-10-10 161208](https://github.com/user-attachments/assets/c6393e0d-192f-49ac-b64a-f75baf931ff5)

```bash
ls /var/lib/jenkins/jobs/ansible/builds/<build_number>/archive/
```

__Note:__ Trigger Jenkins project execution only for /main (master) branch.

Now your setup will look like this:


__Tip__: Allocate an Elastic IP to your Jenkins-Ansible server to avoid reconfigure of GitHub webhook to a new IP address anytime you stop/start your Jenkins-Ansible server.

Allocate elastic IP

Associate the elastic IP

Update the webhook

![Screenshot 2024-10-10 161835](https://github.com/user-attachments/assets/585d0d03-e3af-4c80-babd-b10979fbbf8e)


![Screenshot 2024-10-10 161835](https://github.com/user-attachments/assets/46b8e49e-7089-4bf2-9af7-2e8b23ae67ed)

![Screenshot 2024-10-10 163158](https://github.com/user-attachments/assets/e04f555d-67bb-4826-ada7-993c8aceb644)


__Note:__ Elastic IP is free only when it is being allocated to an EC2 Instance, so do not forget to release Elastic IP once you terminate your EC2 Instance.


## Step 2 – Prepare your development environment using Visual Studio Code

### 1. First part of `DevOps` is `Dev`, which means you will require to write some codes and you shall have proper tools that will make your coding and debugging comfortable – you need an Integrated development environment (IDE) or Source-code Editor.
There is a plethora of different IDEs and Source-code Editors for different languages with their own advantages and drawbacks, you can choose whichever you are comfortable with, but we recommend one free and universal editor that will fully satisfy your needs – [Visual Studio Code (VSC)](https://code.visualstudio.com/download).

### 2. After you have successfully installed `VSC`, configure it to connect to your newly created GitHub repository.

```bash
https://github.com/francdomain/ansible-config-mgt.git
```

### 3. Clone down your ansible-config-mgt repo to your Jenkins-Ansible instance git clone `<ansible-config-mgt repo link>`

![Screenshot 2024-10-10 182316](https://github.com/user-attachments/assets/fd5756f0-13f2-46af-9776-a746e5d1f4ff)

## Step 3 - Begin Ansible Development

### 1. In your ansible-config-mgt GitHub repository, create a new branch that will be used for development of a new feature

__Tip:__ Give your branches descriptive and comprehensive names, for example, if you use Jira or Trello as a project management tool - include ticket number (e.g. PRJ-num) in the name of your branch and add a topic and a brief description what this branch is about - a bugfix, hotfix, feature, release (e.g. feature/prj-145-lvm)

```bash
git checkout -b feature/prj-11-ansible-config
```

![Screenshot 2024-10-10 182330](https://github.com/user-attachments/assets/f8130fc9-fd8d-48b7-98cc-95f5c5ed8097)

### 2. Checkout the newly created feature branch to your local machine and start building your code and directory structure

```bash
git fetch
git checkout feature/prj-11-ansible-config
```
### 3. Create a directory and name it `playbooks` - it will be used to store all your playbook files.

```bash
mkdir playbooks
```

### 4. Create a directory and name it `inventory` - it will be used to keep your hosts organised

```bash
mkdir inventory
```


### 5. Within the playbooks folder, create your first playbook, and name it common.yml

```bash
touch playbooks/common.yml
```

### 6. Within the inventory folder, create an inventory file (.yml) for each environment (Development, Staging, Testing and Production) dev, staging, uat, and prod respectively.

```bash
touch inventory/dev.yml inventory/staging.yml inventory/uat.yml inventory/prod.yml
```
These inventory files use .ini languages style to configure Ansible hosts.

![Screenshot 2024-10-10 182541](https://github.com/user-attachments/assets/1286cf8f-9e2a-4a70-a113-bc21fca5b551)
![Screenshot 2024-10-10 185828](https://github.com/user-attachments/assets/63e41834-65d5-49b6-969f-a2b4d9290ede)
![Screenshot 2024-10-10 185843](https://github.com/user-attachments/assets/1b7d052e-176f-4205-bba5-5de8ae004182)
![Screenshot 2024-10-10 182344](https://github.com/user-attachments/assets/b350b9e4-653c-4b3c-b6c0-7668b2ad1325)


## Step 4 - Set up an Ansible Inventory

An Ansible inventory file defines the hosts and groups of hosts upon which commands, modules, and tasks in a playbook operate. Since our intention is to execute Linux commands on remote hosts, and ensure that it is the intended configuration on a particular server that occurs. It is important to have a way to organize our hosts in such an Inventory

Save the below inventory structure in the `inventory/dev` file to start configuring your development servers. Ensure to replace the IP addresses according to your own setup.

__Note:__ Ansible uses TCP port 22 by default, which means it needs to ssh into target servers from Jenkins-Ansible host - for this you can implement the concept of [ssh-agent](https://smallstep.com/blog/ssh-agent-explained/). Now you need to import your key into `ssh-agent`:

To learn how to setup SSH agent and connect VS Code to your Jenkins-Ansible instance, please see this video:

- For Windows users - [ssh-agent on windows](https://www.youtube.com/watch?v=OplGrY74qog)
- For Linux users - [ssh-agent on linux](https://www.youtube.com/watch?v=OplGrY74qog)


__Start the SSH Agent:__

This starts the `SSH agent` in your current terminal session and sets the necessary environment variables.

```bash
eval `ssh-agent -s`
```
__Add Your SSH Key:__

Add your `SSH private key` to the agent. replace the path with the correct path to the private key.

```bash
ssh-add <path-to-private-key>
```

![Screenshot 2024-10-10 190139](https://github.com/user-attachments/assets/eef13c2f-51a4-4add-b254-75eccef5c0f5)
![Screenshot 2024-10-10 190605](https://github.com/user-attachments/assets/057a701b-fd3f-44ab-82dc-838118abe486)
![Screenshot 2024-10-10 191224](https://github.com/user-attachments/assets/a9406863-00f1-4a97-b38d-345019236e83)

__Verify the Key is Loaded:__

Check that your key has been successfully added to the SSH agent. you should see the name of your key

```bash
ssh-add -l
```


__Now, ssh into your Jenkins-Ansible server using ssh-agent__

```bash
ssh -A ubuntu@public-ip
```
![Screenshot 2024-10-10 190139](https://github.com/user-attachments/assets/4823b338-212b-4073-9a17-d624ffe53214)
![Screenshot 2024-10-10 190605](https://github.com/user-attachments/assets/e4cdaf38-f197-4e45-bfa4-da30e62e2b2e)
![Screenshot 2024-10-10 191224](https://github.com/user-attachments/assets/3e789a7c-2c4a-4fd2-add6-36d5e95cbb1e)


To learn how to setup SSH agent and connect VS Code to your Jenkins-Ansible instance, See this video: [Windows](https://www.youtube.com/watch?v=OplGrY74qog) [Linux](https://www.youtube.com/watch?v=RRRQLgAfcJw)

Also notice, that your Load Balancer user is ubuntu and user for RHEL-based servers is ec2-user

__Update your `inventory/dev.yml` file with this snippet of code:__

```yaml
all:
  children:
    nfs:
      hosts:
        <NFS-Server-Private-IP-Address>:
          ansible_ssh_user: ec2-user
    webservers:
      hosts:
        <Web-Server1-Private-IP-Address>:
          ansible_ssh_user: ec2-user
        <Web-Server2-Private-IP-Address>:
          ansible_ssh_user: ec2-user
    db:
      hosts:
        <Database-Private-IP-Address>:
          ansible_ssh_user: ubuntu
    lb:
      hosts:
        <Load-Balancer-Private-IP-Address>:
          ansible_ssh_user: ubuntu
```

![Screenshot 2024-10-10 190139](https://github.com/user-attachments/assets/6eca913a-f7cd-4147-bd31-c9ae92a5f632)
![Screenshot 2024-10-10 190605](https://github.com/user-attachments/assets/19a6c08e-1067-4a8f-9aff-9a2ed00bec6e)
![Screenshot 2024-10-10 191224](https://github.com/user-attachments/assets/30b3a6a9-07ef-41ba-99c5-4a122c40bee8)
![Screenshot 2024-10-10 192100](https://github.com/user-attachments/assets/a6ff2db6-99c1-4a51-92fe-8ec4bfea5843)
![Screenshot 2024-10-10 192131](https://github.com/user-attachments/assets/ce55a3c8-b73b-40af-93a2-6ef0b4348201)
![Screenshot 2024-10-10 194333](https://github.com/user-attachments/assets/8306568a-35de-4823-a1a4-fc70303d8553)

## Step 5 - Create a Common Playbook

It is time to start giving Ansible the instructions on what you need to be performed on all servers listed in `inventory/dev`

In `common.yml` playbook you will write configuration for repeatable, re-usable, and multi-machine tasks that is common to systems within the infrastructure.

__Update your `playbooks/common.yml` file with following code__

```yaml
---
- name: Update web and NFS servers
  hosts: webservers, nfs
  remote_user: ec2-user
  become: true
  become_user: root
  tasks:
    - name: Ensure wireshark is at the latest version
      yum:
        name: wireshark
        state: latest

- name: Update LB and DB servers
  hosts: lb, db
  remote_user: ubuntu
  become: true
  become_user: root
  tasks:
    - name: Update apt repo
      apt:
        update_cache: yes

    - name: Ensure wireshark is at the latest version
      apt:
        name: wireshark
        state: latest
```
![Screenshot 2024-10-10 195844](https://github.com/user-attachments/assets/a0d31b6f-e743-458c-a920-2bfaa9240f46)


Examine the code above and try to make sense out of it. This playbook is divided into two parts, each of them is intended to perform the same task :

install `wireshark` utility (or make sure it is updated to the latest version) on your RHEL 9 and Ubuntu servers.
It uses root user to perform this task and respective package manager: `yum` for RHEL 9 and `apt` for Ubuntu.

Feel free to update this playbook with following tasks:

- Create a directory and a file inside it

- Change timezone on all servers

- Run some shell script

For a better understanding of Ansible playbooks - [watch this video from RedHat](https://www.youtube.com/watch?v=ZAdJ7CdN7DY) and read [this article](https://www.redhat.com/en/topics/automation/what-is-an-ansible-playbook) - What is an Ansible Playbook?


## Step 6 - Update GIT with the latest code

Now all of your directories and files live on your machine and you need to push changes made locally to GitHub.

`
In the real world, you will be working within a team of other DevOps engineers and developers. It is important to learn how to collaborate with help of GIT. In many organisations there is a development rule that do not allow to deploy any code before it has been reviewed by an extra pair of eyes - it is also called Four eyes principle.
`
Now you have a separate branch, you will need to know how to raise a `Pull Request (PR)`, get your branch peer reviewed and merged to the `main` branch.


__Commit your code into GitHub:__

1. Use git commands to add, commit and push your branch to GitHub.

```bash
git status

git add <selected files>

git commit -m "commit message"

git push origin <the feature branch>
```

![Screenshot 2024-10-10 195853](https://github.com/user-attachments/assets/8b0f89e3-3509-499f-a163-fece0c6aae8f)


2. Create a Pull Request (PR)

![Screenshot 2024-10-10 200316](https://github.com/user-attachments/assets/516ab39b-4c65-409b-8070-bcf6f559698b)


3. Wear the hat of another developer for a second, and act as a reviewer.

![Screenshot 2024-10-10 200331](https://github.com/user-attachments/assets/55024177-39ec-4719-9d26-81b7ab68f7fb)


4. If the reviewer is happy with your new feature development, merge the code to the main branch.

![Screenshot 2024-10-10 200331](https://github.com/user-attachments/assets/b6bf3a5e-e268-4af1-a4cc-f7d9dc6b508c)

5. Head back on your terminal, checkout from the feature branch into the master, and pull down the latest changes

![Screenshot 2024-10-10 200412](https://github.com/user-attachments/assets/c2601160-417c-470f-9bd4-7bc7a5f880c6)

![Screenshot 2024-10-10 200727](https://github.com/user-attachments/assets/7928f188-bd44-42b3-a8d0-eff6e46b1e89)

Once your code changes appear in main branch - Jenkins will do its job and save all the files (build artifacts) to

Console Output

Check the artifact directory
```bash
/var/lib/jenkins/jobs/ansible/builds/<build_number>/archive/
```
![Screenshot 2024-10-10 200904](https://github.com/user-attachments/assets/f0392d9c-1621-4c6c-8238-cb8f9f971f3f)


## Step 7 - Run first Ansible test

Now, it is time to execute ansible-playbook command and verify if your playbook actually works: first setup our vs code to connect our instance for remote development, follow these steps:

1. Install Remote Development and Remote - SSH Extension

![Screenshot 2024-10-10 201820](https://github.com/user-attachments/assets/ceaef14f-eccc-4834-88b9-61d7519eac37)

2. Configure the SSH Host


Another VSCODE opens showing the access mode and the name of the remote server (`SSH: jenkins-ansible`) at the top and at the bottom left conner. This indicates that we are now in the remote server

![Screenshot 2024-10-10 201830](https://github.com/user-attachments/assets/e6a5e5f2-2ece-441a-9f31-0975e145df65)

3. Run ansible-playbook command:

```bash
ansible-playbook -i inventory/dev.yml playbooks/common.yml
```
![Screenshot 2024-10-10 201830](https://github.com/user-attachments/assets/0789ff3a-ec85-45e5-baeb-e5f4d3f64b22)


You can go to each of the servers and check if wireshark has been installed by running

```bash
which wireshark

or

wireshark --version
```

Your updated with Ansible architecture now looks like this:

![Screenshot 2024-10-11 100443](https://github.com/user-attachments/assets/e2c8233e-afc1-4a08-a96d-e82dc277f40c)
![Screenshot 2024-10-11 053718](https://github.com/user-attachments/assets/d05a1921-cdb9-482b-a4e6-f0db3cea0cc2)
![Screenshot 2024-10-11 073846](https://github.com/user-attachments/assets/f290f1cd-9e53-41bb-99f6-0be0540009c1)
![Screenshot 2024-10-11 073941](https://github.com/user-attachments/assets/26f11c63-77fe-4168-b945-21fe30039d4a)

Mmake sure the code ran successfully:

![Screenshot 2024-10-14 053503](https://github.com/user-attachments/assets/63c66d98-fbd9-4852-ba16-c2deb9fe41b6)
![Screenshot 2024-10-14 053433](https://github.com/user-attachments/assets/d7eb2ad0-f2b9-47dd-a997-8525e28b897a)


## Optional step - Repeat once again

Update your ansible playbook with some new Ansible tasks and go through the full checkout -> change codes->commit -> PR -> merge -> build -> ansible-playbook cycle again to see how easily you can manage a servers fleet of any size with just one command!

![Screenshot 2024-10-11 103512](https://github.com/user-attachments/assets/9a96888e-92c7-4c2e-9ee9-1cebb47df726)



We have just automated our routine tasks by implementing with Ansible configurations.
