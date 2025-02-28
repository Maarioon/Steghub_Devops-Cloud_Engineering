Automate Infrastructure With IaC using Terraform 4 (Terraform Cloud)
What Terraform Cloud is and why use it
By now, you should be pretty comfortable writing Terraform code to provision Cloud infrastructure using Configuration Language (HCL). Terraform is an open-source system, that you installed and ran a Virtual Machine (VM) that you had to create, maintain and keep up to date. In Cloud world it is quite common to provide a managed version of an open-source software. Managed means that you do not have to install, configure and maintain it yourself - you just create an account and use it "as A Service".

Terraform Cloud is a managed service that provides you with Terraform CLI to provision infrastructure, either on demand or in response to various events.

By default, Terraform CLI performs operation on the server whene it is invoked, it is perfectly fine if you have a dedicated role who can launch it, but if you have a team who works with Terraform - you need a consistent remote environment with remote workflow and shared state to run Terraform commands.

Terraform Cloud executes Terraform commands on disposable virtual machines, this remote execution is also called remote operations.

Migrate your .tf codes to Terraform Cloud
Let us explore how we can migrate our codes to Terraform Cloud and manage our AWS infrastructure from there:

1. Create a Terraform Cloud account
Follow [this link](https://app.terraform.io/public/signup/account), create a new account, verify your email and you are ready to start.

Most of the features are free, but if you want to explore the difference between free and paid plans - you can check it on this page.

2. Create an organization
Select Start from scratch, choose a name for your organization and create it.
![Screenshot 2025-01-14 102640](https://github.com/user-attachments/assets/8b37220b-b2d4-42c8-a47f-0b9a3d2b0a72)
![Screenshot 2025-01-14 102553](https://github.com/user-attachments/assets/5bd0eb3f-92a0-4f59-a24b-dac96a33a2b0)
![Screenshot 2025-01-14 101630](https://github.com/user-attachments/assets/051e9b0a-4cd1-4732-a052-529037e1d44e)
3. Configure a workspace
Before we begin to configure our workspace - watch this part of the video to better understand the difference between version control workflow, CLI-driven workflow and API-driven workflow and other configurations that we are going to implement.
We will use version control workflow as the most common and recommended way to run Terraform commands triggered from our git repository.

Create a new repository in your GitHub and call it terraform-cloud, push your Terraform codes developed in the previous projects to the repository.

Choose version control workflow and you will be promped to connect your GitHub account to your workspace - follow the prompt and add your newly created repository to the workspace.
Move on to Configure settings, provide a description for your workspace and leave all the rest settings default, click Create workspace
![Screenshot 2025-01-18 153415](https://github.com/user-attachments/assets/6ffe8040-970a-4447-9dc0-59e53fc57c61)
![Screenshot 2025-01-18 153335](https://github.com/user-attachments/assets/7d91787c-cdc2-4155-acfb-89e0b08b19c2)
![Screenshot 2025-01-18 082111](https://github.com/user-attachments/assets/c942c8de-eb87-4e94-8fdf-68870f740029)
![Screenshot 2025-01-18 153705](https://github.com/user-attachments/assets/68a7f492-9ab0-40fa-b286-0f6dedfb70ad)
4. Configure variables
Terraform Cloud supports two types of variables: environment variables and Terraform variables. Either type can be marked as sensitive, which prevents them from being displayed in the Terraform Cloud web UI and makes them write-only.

Set two environment variables: AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY, set the values that you used in the last two projects. These credentials will be used to privision your AWS infrastructure by Terraform Cloud.

![Screenshot 2025-01-18 154244](https://github.com/user-attachments/assets/e14ab3e6-0c22-4bb2-90df-c7ddef056a92)
After you have set these 2 environment variables - your Terraform Cloud is all set to apply the codes from GitHub and create all necessary AWS resources.

5. Now it is time to run our Terrafrom scripts
But in our previous project, we talked about using Packer to build our images, and Ansible to configure the infrastructure, so for that we are going to make few changes to our our existing respository from the last project.

The files that would be Addedd is;

AMI: for building packer images
Ansible: for Ansible scripts to configure the infrastucture
Before we proceed, we need to ensure we have the following tools installed on our local machine;

packer
![Screenshot 2025-01-19 064758](https://github.com/user-attachments/assets/83e8153f-3b76-4838-a708-22de945bda02)
Ansible

![Screenshot 2025-01-19 064808](https://github.com/user-attachments/assets/3df7b920-38b1-4977-9197-3690e74123e0)
Refer to this repository for guidiance on how to refactor your enviroment to meet the new changes above and ensure you go through the README.md file.

Action Plan for this project
Build images using packer

confirm the AMIs in the console

update terrafrom script with new ami IDs generated from packer build

create terraform cloud account and backend

run terraform script

update ansible script with values from teraform output

RDS endpoints for wordpress and tooling
Database name, password and username for wordpress and tooling
Access point ID for wordpress and tooling
Internal load balancee DNS for nginx reverse proxy
run ansible script

check the website

To follow file structure create a new folder and name it AMI. In this folder, create Bastion, Nginx and Webserver (for Tooling and Wordpress) AMI Packer template (bastion.pkr.hcl, nginx.pkr.hcl, ubuntu.pkr.hcl and web.pkr.hcl).
<img width="205" alt="folder-structure" src="https://github.com/user-attachments/assets/f4618710-8843-4b0c-8774-fb6894709a61" />

### Action Plan for this project

- Build images using packer
- confirm the AMIs in the console
- update terrafrom script with new ami IDs generated from packer build
- create terraform cloud account and backend
- run terraform script
- update ansible script with values from teraform output
     - RDS endpoints for wordpress and tooling
     - Database name, password and username for wordpress and tooling
     - Access point ID for wordpress and tooling
     - Internal load balancee DNS for nginx reverse proxy

- run ansible script
- check the website

To follow file structure create a new folder and name it `AMI`. In this folder, create Bastion, Nginx and Webserver (for Tooling and Wordpress) AMI Packer template (`bastion.pkr.hcl`, `nginx.pkr.hcl`, `ubuntu.pkr.hcl` and `web.pkr.hcl`).

Packer template is a `JSON` or `HCL` file that defines the configurations for creating an AMI. Each AMI Bastion, Nginx and Web (for Tooling and WordPress) will have its own Packer template, or we can use a single template with multiple builders.

## Create packer template code for each.

To get the `source AMI owner`, run this command

```bash
aws ec2 describe-images --filters "Name=name,Values=RHEL-9.4.0_HVM-20240605-x86_64-82-Hourly2-GP3" --query "Images[*].{ID:ImageId,Name:Name,Owner:OwnerId}" --output table
```
Ensure to update `Values` with the correct ami name

__Output__
![Screenshot 2025-01-24 042555](https://github.com/user-attachments/assets/c9a2591b-fe15-4db1-97de-dfe21c9d6c0d)
![Screenshot 2025-01-23 113859](https://github.com/user-attachments/assets/5757afce-6cb2-450b-a71c-f9207693728f)
![Screenshot 2025-01-24 054941](https://github.com/user-attachments/assets/377b2397-5e93-4505-84a7-0fa8cf457968)
![Screenshot 2025-01-24 054928](https://github.com/user-attachments/assets/185d7852-00e7-4155-911f-cce0e89b1acf)
![Screenshot 2025-01-24 051511](https://github.com/user-attachments/assets/3a85c948-f336-41fd-84a7-6dba3a7e5356)
![Screenshot 2025-01-24 050943](https://github.com/user-attachments/assets/e8cd2fd3-2f68-4bff-b44a-44debfcbe11c)
![Screenshot 2025-01-24 050818](https://github.com/user-attachments/assets/39af4d36-4d11-4a6d-9f9f-a2b8511024ef)

### Packer code for bastion
To format a specific Packer configuration file, use the following command

```hcl
packer fmt <name>.pkr.hcl

packer fmt bastion.pkr.hcl
packer fmt nginx.pkr.hcl
packer fmt ubuntu.pkr.hcl
packer fmt web.pkr.hcl
```
### Initialize the Plugins

```hcl
packer init bastion.pkr.hcl
```
```hcl
packer validate bastion.pkr.hcl
packer validate nginx.pkr.hcl
packer validate ubuntu.pkr.hcl
packer validate web.pkr.hcl
```

### Run the packer commands to build AMI for Bastion server, Nginx server and webserver

### For Bastion

```hcl
packer build bastion.pkr.hcl
```
### For Nginx

```hcl
packer build nginx.pkr.hcl
```

### For Webservers

```hcl
packer build web.pkr.hcl
```
### For Ubuntu (Jenkins, Artifactory and sonarqube Server)

```hcl
packer build ubuntu.pkr.hcl
```

![Screenshot 2025-01-28 090159](https://github.com/user-attachments/assets/7e5e041f-117e-4bea-9bf5-7dd012f6c4f5)

### The new AMI's from the packer build in the terraform script
In the terraform director, update the `terraform.auto.tfvars` with the new AMIs IDs built with packer which terraform will use to provision Bastion, Nginx, Tooling and Wordpress server
![Screenshot 2025-01-30 153150](https://github.com/user-attachments/assets/04ceba1a-4cf7-4b48-891e-c6c06f22c606)

## 6. Run `terraform plan` and `terraform apply` from web console
![Screenshot 2025-01-30 051241](https://github.com/user-attachments/assets/a89bd744-05b0-4515-b93d-6a4eee2597b7)
![Screenshot 2025-01-30 150200](https://github.com/user-attachments/assets/70fe3ed7-7a65-472a-a4de-615cd0d70c37)
![Screenshot 2025-01-30 145610](https://github.com/user-attachments/assets/54b2f45b-e93a-4ef0-9a9b-2574c74927d1)
![Screenshot 2025-01-30 145433](https://github.com/user-attachments/assets/028b9a0f-b18c-4fa3-806b-8019a877d189)
![Screenshot 2025-01-30 145133](https://github.com/user-attachments/assets/0d02de3a-a506-4ea8-b2a2-3b8701e94cc2)
![Screenshot 2025-01-30 145118](https://github.com/user-attachments/assets/84788617-9962-4bf8-a004-102bf2c64201)
![Screenshot 2025-01-30 063533](https://github.com/user-attachments/assets/d9b720aa-4f45-4acd-bc12-83029b079191)

- Switch to `Runs` tab and click on `Queue plan manualy` button.

![Screenshot 2025-01-26 042102](https://github.com/user-attachments/assets/93d2cb7f-7933-4849-90ee-44212813f6c6)
![Screenshot 2025-01-28 085239](https://github.com/user-attachments/assets/91bf26be-4543-4c9f-9e3f-b7b94536b7d1)
![Screenshot 2025-01-28 085156](https://github.com/user-attachments/assets/79126575-5e5f-4ee8-8144-2c647df697b3)
![Screenshot 2025-01-28 085147](https://github.com/user-attachments/assets/7c20a361-9040-47c4-af11-92d7b22daf37)

![Screenshot 2025-01-30 030824](https://github.com/user-attachments/assets/ad306af0-5e49-4f83-9bbe-0a8782eb6d72)
![Screenshot 2025-01-30 030813](https://github.com/user-attachments/assets/af5f489f-9049-41f8-9af0-4959ea9fbd65)
![Screenshot 2025-01-30 025923](https://github.com/user-attachments/assets/2642841f-d06c-4d72-aa7e-4f3700c5daef)
![Screenshot 2025-01-30 025358](https://github.com/user-attachments/assets/6fe09fc7-b93c-4ada-9b94-058e24126483)

![Screenshot 2025-01-30 051241](https://github.com/user-attachments/assets/3b03d9c6-edf8-4cd6-a7fc-1befee0ff5c3)
![Screenshot 2025-01-30 063533](https://github.com/user-attachments/assets/63baff3a-8960-4791-a9cc-227c234ad27d)
- If planning has been successfull, you can proceed and confirm Apply - press `Confirm and apply`, provide a comment and `Confirm plan`
Check the logs and verify that everything has run correctly. Note that Terraform Cloud has generated a unique state version that you can open and see the codes applied and the changes made since the last run.

Check the AWS console

![Screenshot 2025-01-30 083155](https://github.com/user-attachments/assets/715818fa-552a-485e-b19e-cdaae83354ea)
![Screenshot 2025-01-30 083043](https://github.com/user-attachments/assets/2b55b23f-ad61-41ab-856f-c6550fb1c136)

## 7. Test automated `terraform plan`

By now, you have tried to launch `plan` and `apply` manually from Terraform Cloud web console. But since we have an integration with GitHub, the process can be triggered automatically. Try to change something in any of `.tf` files and look at `Runs` tab again - `plan` must be launched automatically, but to `apply` you still need to approve manually.

Since provisioning of new Cloud resources might incur significant costs. Even though you can configure `Auto apply`, it is always a good idea to verify your `plan` results before pushing it to `apply` to avoid any misconfigurations that can cause 'bill shock'.
![Screenshot 2025-01-31 045521](https://github.com/user-attachments/assets/9e09b591-b338-48ed-a914-188380bc6033)
![Screenshot 2025-01-31 045512](https://github.com/user-attachments/assets/f9cfa234-07d8-452b-8986-e41cdde18157)
![Screenshot 2025-01-31 045501](https://github.com/user-attachments/assets/92927399-8939-4fd7-83bf-064e6fc0be7d)
![Screenshot 2025-01-31 045443](https://github.com/user-attachments/assets/285be45d-2a87-4d02-9631-809ec5268b57)
![Screenshot 2025-01-31 045427](https://github.com/user-attachments/assets/bce09a0b-7e80-4554-8915-6f6201146f31)
![Screenshot 2025-01-31 045231](https://github.com/user-attachments/assets/a70be8b7-ff82-45d3-a674-30124e5bd554)
![Screenshot 2025-01-31 045221](https://github.com/user-attachments/assets/fa8c97fa-c643-48d5-af44-c81f9068aa71)
![Screenshot 2025-01-31 045159](https://github.com/user-attachments/assets/026cb9a1-f993-4652-9852-4416afdb589b)
![Screenshot 2025-01-31 045148](https://github.com/user-attachments/assets/7cfb60f7-b663-4ff9-8fa2-22aad5b37b9d)
![Screenshot 2025-01-31 045135](https://github.com/user-attachments/assets/82ecffe8-ff62-45b1-a3e7-60358a6938ee)
![Screenshot 2025-01-31 045630](https://github.com/user-attachments/assets/31f68ff2-8bee-49eb-828b-9836770e3631)
![Screenshot 2025-01-31 045536](https://github.com/user-attachments/assets/77650548-cc4a-46c0-b238-265aee169e8a)

__Follow the steps below to set up automatic triggers for Terraform plans and apply operations using GitHub and Terraform Cloud:__

1. Configure a GitHub account as a Version Control System (VCS) provider in Terraform Cloud and follow steps

- Add a VCS provider
- - Go to `Version Control` and click on `Change source`
  - - Click on `GitHub.com (Custom)`
    - - Select the repository
![Screenshot 2025-01-31 052843](https://github.com/user-attachments/assets/047f3355-3e1e-4b41-b39e-8f26c45f83fb)
![Screenshot 2025-01-31 052611](https://github.com/user-attachments/assets/6e4639e9-dfc3-4534-8c8a-1b86e9f59f58)
![Screenshot 2025-01-31 050532](https://github.com/user-attachments/assets/9a071e23-d8bb-452e-8438-9312de9a8baa)

#### Make a change to any Terraform configuration file (.tf file)

Security group decription was edited in the variables.tf file and pushed to the repository on github that is linked to our Terraform Cloud workspace.

#### Check Terraform Cloud

Click on `Runs` tab in the Terraform Cloud workspace. Notice that a new plan has been automatically triggered as a result of the push.
![Screenshot 2025-02-01 033309](https://github.com/user-attachments/assets/35f9685e-4d1a-4d06-aca1-f27135114d31)
![Screenshot 2025-02-01 033320](https://github.com/user-attachments/assets/32c0dc44-c8f1-4f6e-822b-6a4855975f3b)

__Note:__ First, try to approach this project on your own, but if you hit any blocker and could not move forward with the project, refer to [support](https://www.youtube.com/watch?v=nCemvjcKuIA).

# Configuring The Infrastructure With Ansible

- After a successful execution of terraform apply, connect to the bastion server through ssh-agent to run ansible against the infrastructure.

Run this commands to forward the ssh private key to the bastion server.

```bash
eval `ssh-agent -s`
ssh-add <private-key.pem>
ssh-add -l
```
![Screenshot 2025-02-09 051146](https://github.com/user-attachments/assets/d6c3d8e0-b074-4701-8022-b60c04b661d1)

- Update the `nginx.conf.j2` file to input the internal load balancer dns name generated.
![Screenshot 2025-02-09 050820](https://github.com/user-attachments/assets/34513151-5771-403a-a0b2-a9172ca426d1)
- Update the `RDS endpoints`, `Database name`, `password` and `username` in the `setup-db.yml` file for both the `tooling` and `wordpress` role.

__For Tooling__
![Screenshot 2025-02-09 050750](https://github.com/user-attachments/assets/ebfdbc33-6607-40b4-98e9-0e73663d01e7)

__For Wordpress__
![Screenshot 2025-02-09 051146](https://github.com/user-attachments/assets/341e7319-ca2a-4bb1-8383-8a08106317da)
- Update the `EFS` `Access point ID` for both the `wordpress` and `tooling` role in the `main.yml`

__For Tooling__

![Screenshot 2025-02-09 051503](https://github.com/user-attachments/assets/eefe3520-2021-44d2-918f-99742a6379c4)
__For Wordpress__
![Screenshot 2025-02-09 051601](https://github.com/user-attachments/assets/865e3a2f-e3e1-4a1c-88c1-7d214632e8b5)

### Access the bastion server with ssh agent

```bash
ssh -A ec2-user@<bastion-pub-ip>
```
Confirm ansible is installed on bastion server
![Screenshot 2025-02-27 125450](https://github.com/user-attachments/assets/0bc8f911-b107-4599-9a07-18ec07615844)
- Verify the inventory
- 
Export the environment variable `ANSIBLE_CONFIG` to point to the `ansible.cfg` from the repo and run the ansible-playbook command:

```bash
export ANSIBLE_CONFIG=/home/ec2-user/terraform-cloud/ansible/roles/ansible.cfg

ansible-playbook -i inventory/aws_ec2.yml playbook/site.yml
```
![Screenshot 2025-02-27 132050](https://github.com/user-attachments/assets/8367ba03-bace-426e-9d20-53df07c7c184)
![Screenshot 2025-02-27 161314](https://github.com/user-attachments/assets/9a720b79-88e5-4aec-a0b5-907073e9c846)
![Screenshot 2025-02-27 161256](https://github.com/user-attachments/assets/ce402c40-3f13-4584-b726-a4a1d5ed09ad)

#### Access wordpress and tooling website via a browser

Tooling website
![Screenshot 2025-02-27 161327](https://github.com/user-attachments/assets/4c8456c6-2a6a-4466-88bf-38878c8ba823)
Wordpress website
![Screenshot 2025-02-27 161327](https://github.com/user-attachments/assets/143fbc86-dc9d-4914-a34c-c77ee5e01aa2)

# Practice Task №1

1. Configure 3 branches in the `terraform-cloud` repository for `dev`, `test`, `prod` environments
2. Make necessary configuration to trigger runs automatically only for dev environment

- Create a workspace each for the 3 environments (i.e, `dev`, `test`, `prod`).
![Screenshot 2025-02-27 161402](https://github.com/user-attachments/assets/f8f01b07-3bb7-48ab-b4c8-c6a702c2ca1a)
![Screenshot 2025-02-27 161348](https://github.com/user-attachments/assets/09108902-b8d9-44b2-9855-f9c18b371152)
![Screenshot 2025-02-27 161542](https://github.com/user-attachments/assets/b38e7719-22a4-408c-b9c7-49e3d405cf66)
![Screenshot 2025-02-27 161454](https://github.com/user-attachments/assets/ee7996f3-8a73-459f-8e5a-e88dc8829559)

- Configure `Auto-Apply` for `dev` workspace to trigger runs automatically
![Screenshot 2025-02-27 161752](https://github.com/user-attachments/assets/fbbe13c1-092c-46f9-ba97-ee44e70bf9ee)
![Screenshot 2025-02-27 161721](https://github.com/user-attachments/assets/b1da8be2-69d5-48c9-af83-60e0915c1232)

Go to the dev workspace in Terraform Cloud > Navigate to Settings > Vsersion Control > Check boxes for Auto Apply
3. Create an Email and Slack notifications for certain events (e.g. `started plan` or `errored run`) and test it.

__Email Notification:__ In the dev workspace, Go to Settings > Notifications > Add a new notification

The bastion instance type was changed to t3.small in order to test it
![Screenshot 2025-02-27 161832](https://github.com/user-attachments/assets/c9925188-6c97-4dbd-b169-b72e81c7bb04)
![Screenshot 2025-02-27 161818](https://github.com/user-attachments/assets/fa743384-495a-4b02-b87c-ab9914aece84)
![Screenshot 2025-02-27 161922](https://github.com/user-attachments/assets/6bd0367a-4912-4851-811a-3bce07187e72)
![Screenshot 2025-02-27 161854](https://github.com/user-attachments/assets/1367ad21-a011-47fc-bcf1-9a1c6738a14e)

This will automatically apply after a successful plan

Confirm notification has bben sent to the provided email address
### Slack Notification:

We will need to create a `Webhook URL` for the slack channel we want to send message to before creating the notification.

__Slack Notification Setup__

i. Visite [https://api.slack.com/apps?new_app=1](https://api.slack.com/apps?new_app=1).

ii. In the resulting popup, select Create an app > From scratch

iii. Choose a name > select the workspace you would like to send your notifications > Create App

![](./images/create-slack-app.png)

iv. Click on `install to <Selected slack workspace name>` to install the Notification App

v. Select Incoming Webhooks and copy the webhook URL.

Now, let's create the slack notification (paste the webhook url)

![Screenshot 2025-02-27 162020](https://github.com/user-attachments/assets/ca7167dd-7c5f-47d6-83a2-54b259ff44f2)
![Screenshot 2025-02-27 162003](https://github.com/user-attachments/assets/850593b3-2a29-4d0a-a0bb-40f147e2872e)
![Screenshot 2025-02-27 161922](https://github.com/user-attachments/assets/f9da4e1e-666d-4eae-b5d3-5973dc483d34)
![Screenshot 2025-02-27 161854](https://github.com/user-attachments/assets/fbd9d93d-bb40-44b5-a8b5-f5f66eaa0291)
![Screenshot 2025-02-27 162429](https://github.com/user-attachments/assets/8f4dc38a-b450-4e2c-9414-88bce1e2f267)
![Screenshot 2025-02-27 162412](https://github.com/user-attachments/assets/45d400de-2a37-45d3-9a2d-9948e74be66f)
![Screenshot 2025-02-27 162338](https://github.com/user-attachments/assets/17c5d7e1-70f8-431e-917a-4ab61441fd09)

The bastion instance type was changed back to t2.small in order to test it

Confirm the terraform process notification sent to the slack channel selected

4. Apply destroy from Terraform Cloud web console.
![Screenshot 2025-02-27 162643](https://github.com/user-attachments/assets/2f5f532c-5535-4eb9-b650-d5fb34d46045)

### Public Module Registry vs Private Module Registry

Terraform has a quite strong community of contributors (individual developers and 3rd party companies) that along with HashiCorp maintain a [Public Registry](https://developer.hashicorp.com/terraform/registry), where you can find reusable configuration packages ([modules](https://developer.hashicorp.com/terraform/registry/modules/use)). We strongly encourage you to explore modules shared to the public registry, specifically for this project - you can check out this [AWS provider registy page](https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/latest).

As your Terraform code base grows, your DevOps team might want to create you own library of reusable components - [Private Registry](https://developer.hashicorp.com/terraform/registry/private) can help with that.

![Screenshot 2025-02-27 161818](https://github.com/user-attachments/assets/e441572d-1fd2-4a5e-af98-b6d5edb8e5e9)
![Screenshot 2025-02-27 161752](https://github.com/user-attachments/assets/415a91c9-e04c-47df-8db0-b1cd3c715f16)
![Screenshot 2025-02-27 161832](https://github.com/user-attachments/assets/67d1bd67-100f-4f33-a9ff-014c0bd91855)

# Practice Task №2

## Working with Private repository

1. Create a simple Terraform repository (you can clone one [from here](https://github.com/hashicorp/learn-private-module-aws-s3-webapp)) that will be your module.
- Under the repository's tab, clicking on `tag` to create tag. click `Create a new release` and adding `v1.0.0` to the tag version field setting the release title to `First module release`
2. Import the module into your private registry

Go to Registery > Module > Add Module > select GitHub (Custom)
Click on __`configure credentials`__ from here

Click on `create an API toekn` from here
Configure the token generated, in the Terraform CLI configuration file `.terraformrc`.

```bash
vim ~/.terraformrc
```
Copy the credentials block below and paste it into the `.terraformrc` file.
Ensure to replace the value of the token argument with the API token created.

```hcl
credentials "app.terraform.io" {
  # valid user API token
  token = "xxxxxxxxx.atlasv1.zzzzzzzzzzzzzzzzz"
}
```
Alternatively, we can choose to export the token using environment varaiabel in the CLI

```bash
export TERRAFORM_CLOUD_TOKEN="xxxxxxxxx.atlasv1.zzzzzzzzzzzzzzzzz"
```
3. Create a configuration that uses the module.

- In your local machine, create a new directory for the Terraform configuration.
Create a `main.tf` file to use the module.
Then click on `Copy configuration` under Usage instructions and paste it into main.tf
__Initialize the Configuration__
![Screenshot 2025-02-27 162412](https://github.com/user-attachments/assets/02d63de6-ba37-46da-a051-5661370cfb3c)

```bash
terraform init
```
4. Create a workspace for the configuration, Select CLI-driven workflow Name the workspace s3-webapp-workspace
Add the code block below to the terraform configuration file to setup the cloud integration.

```hcl
terraform {
  cloud {

    organization = "fnc-project-19"

    workspaces {
      name = "s3-webapp-workspace"
    }
  }
}
```
![Screenshot 2025-02-27 162429](https://github.com/user-attachments/assets/15ac447b-5808-4bac-97f7-205cfa2aec9c)

5. Deploy the infrastructure

Run `terraform apply` to deploy the infrastructure.

6. Destroy your deployment

Run `terraform destroy` to destory the infrastructure

## Conclusion

We have learned how to effectively use managed version of Terraform - `Terraform Cloud`. We have also practiced in finding modules in a Public Module Registry as well as build and deploy our own modules to a Private Module Registry.
