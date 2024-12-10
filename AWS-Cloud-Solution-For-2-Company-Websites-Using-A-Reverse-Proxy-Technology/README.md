# AWS CLOUD SOLUTION FOR 2 COMPANY WEBSITES USING A REVERSE PROXY TECHNOLOGY

## INTRODUCTION

This project demostrates how a secure infrastructure inside AWS VPC (Virtual Private Cloud) network is built for a particular company, who uses [WordPress CMS](https://wordpress.com/) for its main business website, and a [Tooling Website](https://github.com/francdomain/tooling) for their DevOps team. As part of the company’s desire for improved security and performance, a decision has been made to use a [reverse proxy technology from NGINX](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/) to achieve this. The infrastructure will look like following diagram:
![image](./images/architecture.png)

# Starting Off Your AWS Cloud Project

# Set Up a Sub-account And Create A Hosted Zone

There are few requirements that must be met before you begin:

1. Properly configure your AWS account and Organization Unit [Watch How To Do This Here](https://www.youtube.com/watch?v=9PQYCc_20-Q)


   - Create an `AWS Master account`. (Also known as Root Account)
![Screenshot 2024-12-04 151913](https://github.com/user-attachments/assets/e6d50f5f-9267-41a2-bfbb-114ffab5558c)
![Screenshot 2024-12-04 152029](https://github.com/user-attachments/assets/b92059ea-3a45-4f1c-bfd3-8bbe45de32cf)

     Go to AWS console, and navigate to Services > All Services > Management & Governance > AWS Organizations
 - Within the Root account, create a sub-account and name it `DevOps`. (You will need another email address to complete this)

      Navigate to Add an AWS accout > fill the name (DevOps)
![Screenshot 2024-12-04 152237](https://github.com/user-attachments/assets/21c0abed-c40d-4302-8468-38842d8c1528)
![Screenshot 2024-12-04 152352](https://github.com/user-attachments/assets/a9b793ec-2ec0-4555-93c5-5b9d2798e0b6)
  - Login to the newly created AWS account using the new email address.
2. Create a free domain name for your fictitious company at Freenom domain registrar here. We use [cloudns](https://www.cloudns.net) instead or any free domain name you can get, if you cannot get a free one register for a cheap one at www.namecheap.com.
3. Create a hosted zone in AWS, and map it to your free domain from Freenom. Watch how to do that here

   - Go to `route53` and select `create hosted zone`
![Screenshot 2024-12-05 105212](https://github.com/user-attachments/assets/104ecfa0-4455-48f6-83b1-6b9da3cd7013)
![Screenshot 2024-12-04 161229](https://github.com/user-attachments/assets/e867ffb1-d8ef-4ca8-8c19-43962d7588c0)
 Let's map the hosted zone to our free domain

Copy the name server (NS) values from AWS, then go to your domain, edit the default `NS` values and update them with the values from AWS.

Add the NS records to your domain name settings
![Screenshot 2024-12-05 105346](https://github.com/user-attachments/assets/ac8a79f5-6bc1-4ce3-b437-36533319b2ca)

# Set Up a Virtual Private Network (VPC)

Always make reference to the architectural diagram and ensure that your configuration is aligned with it.

### 1. Create a [VPC](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html).

![Screenshot 2024-12-05 123136](https://github.com/user-attachments/assets/da78f474-07ec-4d93-a810-6ec01c6e591b)
### Enable DNS hostnames.

Actions > Edit VPC Settings > Enable DNS hostnames
### 2. Create subnets as shown in the architecture
![Screenshot 2024-12-05 123157](https://github.com/user-attachments/assets/42e701bb-13bc-4a37-a8c8-62c8fff05e71)

Create public and private subnets in each availablity zones respectively. Thus, we create public subnet in availability zone A and B respectively. We create 4 private subnets with respect to the diagram we are working with as such we create 2 private subnets each in availability zone A and B.
![Screenshot 2024-12-05 132954](https://github.com/user-attachments/assets/df07dd93-8b02-4b26-8b9f-841bd057ec76)
Enable Auto-assign public IPv4 address in the public subnets.
Actions > Edit subnet settings > Enable auto-assign public IPv4

### 3. Create a route table and associate it with public subnets
Create a public route table for the public subnets
### 4. Create a route table and associate it with private subnets
Create a private route table for the private subnets
Associate it with private subnets
The route tables
![Screenshot 2024-12-05 134343](https://github.com/user-attachments/assets/b57668c6-73a0-422d-9b9c-7f17c80d1d43)

### 5. Create an [Internet Gateway](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html)
Attach it to the created VPC.
### 6. Edit a route in public route table, and associate it with the Internet Gateway. (This is what allows a public subnet to be accisble from the Internet)

In the public route table, Click route tab > Edit route > Add route
since we are routing traffic to the internet, the destination will be `0.0.0.0/0`

![Screenshot 2024-12-05 142012](https://github.com/user-attachments/assets/3b8811c1-ddcc-4ee5-9061-e325a8be19da)
### 7. Create 3 [Elastic IPs](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/elastic-ip-addresses-eip.html)
![Screenshot 2024-12-05 135249](https://github.com/user-attachments/assets/572b13d7-f551-45f0-9059-20d166081043)

### 8. Create a [Nat Gateway](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html) and assign one of the Elastic IPs (*The other 2 will be used by [Bastion hosts](https://aws.amazon.com/solutions/implementations/linux-bastion/))
![Screenshot 2024-12-05 135353](https://github.com/user-attachments/assets/72a05eed-2db7-43d2-8aa3-fa1678d90352)

### 9. Create a [Security Group](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html#CreatingSecurityGroups) for:
- __External [Application Load Balancer](https://aws.amazon.com/elasticloadbalancing/application-load-balancer/):__ External `ALB` will be available from the Internet
- __Bastion Servers:__ Access to the Bastion servers should be allowed only from workstations that need to SSH into the bastion servers. Hence, you can use your workstation public IP address. To get this information, simply go to your terminal and type `curl www.canhazip.com`
- __Nginx Servers:__ Access to Nginx should only be allowed from an external Application Load balancer (ALB).
- __Internal Application Load Balancer:__ This is `not` an internet facing `ALB` rather used to distribute internal traffic comming from Nginx (reverse proxy) to our Webservers Auto Scalling Groups in our private subnets. It also helps us to prevent single point of failure.
- __Webservers:__ Access to Webservers should only be allowed from the internal ALB.
- __Data Layer:__ Access to the Data layer, which is comprised of [Amazon Relational Database Service (`RDS`)](https://aws.amazon.com/rds/) and [Amazon Elastic File System (EFS)](https://aws.amazon.com/efs/) must be carefully desinged - only webservers should be able to connect to `RDS`, while Nginx and Webservers will have access to `EFS Mountpoint`.
All Security Groups

![Screenshot 2024-12-05 140903](https://github.com/user-attachments/assets/01d1c709-c499-43d8-9d7e-6c52e4575b3a)
# TLS Certificates From Amazon Certificate Manager (ACM)

We will need TLS certificates to handle secured connectivity to our Application Load Balancers (ALB).

1. Navigate to AWS ACM
2. Request a public wildcard certificate for the domain name we registered in Cloudns
3. Use DNS to validate the domain name
4. Tag the resource
![Screenshot 2024-12-06 052506](https://github.com/user-attachments/assets/53a9d44e-c1e3-4b74-a64c-8d1b8842b7a0)
After validating the record, AWS will issue the Certificate and the status changes to issued.

![Screenshot 2024-12-09 204033](https://github.com/user-attachments/assets/a6991786-3ffc-4421-8097-b9c47e231fe9)
# Setup EFS

[Amazon Elastic File System (Amazon EFS)](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AmazonEFS.html) provides a simple, scalable, fully managed elastic [Network File System (NFS)](https://en.wikipedia.org/wiki/Network_File_System) for use with AWS Cloud services and on-premises resources. In this project, we will utulize EFS service and mount filesystems on both Nginx and Webservers to store data.

1. Create an EFS filesystem

2. Create an EFS mount target per AZ in the VPC, associate it with both subnets dedicated for data layer.
__NB:__ Any subnet we specify our mount target, the Amazon EFS becomes available in that subnet. As such, we will specify it in private webserver subnets so that all the resources in that subnet will have the ability to mount to the file system.

3. Associate the Security groups created earlier for data layer
![Screenshot 2024-12-06 054934](https://github.com/user-attachments/assets/aa6da721-4fb0-45ea-aa97-7dcbfe00b1a3)
4. Create an EFS access point.

This will specify where the webservers will mount with, thus creating 2 mount points for Tooling and Wordpress servers each.

Access point for wordpress server
![Screenshot 2024-12-06 055819](https://github.com/user-attachments/assets/1c599c21-9524-4134-bf16-635bfbd00362)
![Screenshot 2024-12-06 055934](https://github.com/user-attachments/assets/4fe5e1b4-69bc-48da-a3c5-17b2898b3897)
Access point for tooling server

![Screenshot 2024-12-06 060246](https://github.com/user-attachments/assets/111068b7-42fa-4aa5-8330-99caad4c1a19)
![Screenshot 2024-12-06 060237](https://github.com/user-attachments/assets/dd42a039-fa61-4718-b236-a456ac5aa2d5)
EFS access points
![Screenshot 2024-12-06 060305](https://github.com/user-attachments/assets/02916c93-7748-4b1d-94d7-8d75efabe38b)

# Setup RDS

### Pre-requisite:
Create a `KMS` key from Key Management Service (KMS) to be used to encrypt the database instance.
![Screenshot 2024-12-06 060633](https://github.com/user-attachments/assets/1f5e7f7b-18e4-4695-90ea-f74e0e19e642)
![Screenshot 2024-12-06 060515](https://github.com/user-attachments/assets/8dabe02a-46ac-4088-8e17-bcae3ec565ff)
![Screenshot 2024-12-06 065744](https://github.com/user-attachments/assets/7cc0d9a0-9093-4993-a03a-4befdee65574)
![Screenshot 2024-12-06 065733](https://github.com/user-attachments/assets/3827b580-d5c9-4dbb-8d66-7f5a7a08ae53)
![Screenshot 2024-12-06 064639](https://github.com/user-attachments/assets/e509846e-d1ba-41b4-9b07-b5972760c81e)
![Screenshot 2024-12-06 060747](https://github.com/user-attachments/assets/4f9cd596-9007-4ba9-b488-7ccebf224494)
![Screenshot 2024-12-06 070031](https://github.com/user-attachments/assets/6f3d0cc4-98fc-49c0-9c6e-fadb5828eada)
Amazon Relational Database Service (Amazon RDS) is a managed distributed relational database service by Amazon Web Services. This web service running in the cloud designed to simplify setup, operations, maintenans & scaling of relational databases. Without RDS, Database Administrators (DBA) have more work to do, due to RDS, some DBAs have become jobless.
To ensure that yout databases are highly available and also have failover support in case one availability zone fails, we will configure a [multi-AZ](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html) set up of [RDS MySQL database](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_MySQL.html) instance. In our case, since we are only using 2 AZs, we can only failover to one, but the same concept applies to 3 Availability Zones. We will not consider possible failure of the whole Region, but for this AWS also has a solution - this is a more advanced concept that will be discussed in following projects.

To configure `RDS`, follow steps below:
1. Create a `subnet group` and add 2 private subnets (data Layer)
2. Create an RDS Instance for `mysql 8.*.*`
3. To satisfy our architectural diagram, you will need to select either `Dev/Test` or `Production` Sample Template. But to minimize AWS cost, you can select the `Do not create a standby instance` option under `Availability & durability` sample template (The production template will enable Multi-AZ deployment)
4. Configure other settings accordingly (For test purposes, most of the default settings are good to go). In the real world, you will need to size the database appropriately. You will need to get some information about the usage. If it is a highly transactional database that grows at 10GB weekly, you must bear that in mind while configuring the initial storage allocation, storage autoscaling, and maximum storage threshold.
5. Configure VPC and security (ensure the database is not available from the Internet)
6. Configure backups and retention
7. Encrypt the database using the KMS key created earlier
8. Enable [CloudWatch](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/monitoring-cloudwatch.html) monitoring and export Error and Slow Query logs (for production, also include Audit)
![Screenshot 2024-12-06 070805](https://github.com/user-attachments/assets/91908fef-a2fb-465c-945c-26d98e1a8c10)
![Screenshot 2024-12-06 070609](https://github.com/user-attachments/assets/5179e01d-b72f-4a42-afc0-246a2aa7f5bf)
![Screenshot 2024-12-06 070516](https://github.com/user-attachments/assets/1ba28591-99e4-4009-a5d1-c5150e9c9a83)
![Screenshot 2024-12-06 070339](https://github.com/user-attachments/assets/0c41ba62-c0e0-4b5a-aa93-8efda40f8101)
![Screenshot 2024-12-06 070156](https://github.com/user-attachments/assets/e18103ce-338b-4a33-857d-f9559d3bc212)
![Screenshot 2024-12-06 073229](https://github.com/user-attachments/assets/7d874b92-6a00-45fc-9243-c442722caffe)
![Screenshot 2024-12-06 071138](https://github.com/user-attachments/assets/a5a97ca9-926d-4c9c-ae84-dfbb0653324c)
# Proceed With Compute Resources

We will need to set up and configure compute resources inside our VPC. The recources related to compute are:

- [EC2 Instances](https://www.amazonaws.cn/en/ec2/instance-types/)
- [Launch Templates](https://docs.aws.amazon.com/autoscaling/ec2/userguide/launch-templates.html)
- [Target Groups](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-target-groups.html)
- [Autoscaling Groups](https://docs.aws.amazon.com/autoscaling/ec2/userguide/auto-scaling-groups.html)
- [TLS Certificates](https://en.wikipedia.org/wiki/Transport_Layer_Security)
- [Application Load Balancers (ALB)](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html)

## Set Up Compute Resources for Nginx, Bastion and Webservers

NB:
To create the `Autoscaling Groups`, we need `Launch Templates` and `Load Balancers`.
The Launch Templates requires `AMI` and `Userdata` while the Load balancer requires `Target Group`

### Provision EC2 Instances for Nginx, Bastion and Webservers

1. Create EC2 Instances based on CentOS [Amazon Machine Image (AMI)](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AMIs.html) per each [Availability Zone in the same Region](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html). Use EC2 instance of [T2 family](https://aws.amazon.com/ec2/instance-types/t2/) (e.g. t2.micro or similar) with security group (All traffic - anywhere).
2. ![Screenshot 2024-12-06 074123](https://github.com/user-attachments/assets/04f883a6-2dc1-4f69-8539-9d5c315908f9)
2. Ensure that it has the following software installed:
- python
- ntp
- net-tools
- vim
- wget
- telnet
- epel-release
- htop

- ![Screenshot 2024-12-08 121758](https://github.com/user-attachments/assets/20ec2bbd-39f6-4f69-84da-bb912908a5cb)
### For Nginx, Bastion and Webserver.

__For Nginx__

```bash
sudo yum install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-9.noarch.rpm
````
```bash
sudo yum install -y dnf-utils http://rpms.remirepo.net/enterprise/remi-release-9.rpm
```
![Screenshot 2024-12-08 013311](https://github.com/user-attachments/assets/6da47ac0-448e-4dd3-a320-cb059ec90a80)
![Screenshot 2024-12-08 060926](https://github.com/user-attachments/assets/ceec35aa-c30d-476d-9de6-b2f9320d45d5)
![Screenshot 2024-12-06 074123](https://github.com/user-attachments/assets/52a9023c-2ea6-49a9-ae21-d192c91aa4d6)
```bash
sudo yum install wget vim python3 telnet htop net-tools ntp -y
```
The error occured because the ntp package is not available in the repositories for our Enterprise Linux 9 system. Instead of ntp, chrony can be used, which is the default NTP implementation in newer versions of RHEL and its derivatives, including Enterprise Linux 9.

```bash
sudo yum install wget vim python3 telnet htop git mysql net-tools chrony -y
```
```bash
sudo systemctl start chronyd
sudo systemctl enable chronyd
sudo systemctl status chronyd
```
![Screenshot 2024-12-06 091433](https://github.com/user-attachments/assets/323bdc39-dcb4-41f0-9a9b-24e6c27010be)
![Screenshot 2024-12-06 092244](https://github.com/user-attachments/assets/0c996440-f995-4e9e-aa08-0ae303a29188)
![Screenshot 2024-12-06 091811](https://github.com/user-attachments/assets/d3a4981a-df23-4c54-a278-49d2eab3375b)
![Screenshot 2024-12-06 091713](https://github.com/user-attachments/assets/690fc639-a64b-4c77-8165-8b82617f38a5)
![Screenshot 2024-12-06 092318](https://github.com/user-attachments/assets/850ecb95-6429-474d-a25d-6ded98296e87)

__NB__: __Repeat the above steps for Bastion and Webservers__


### Nginx and Webserver (Set SELinux policies so that our servers can function properly on all the redhat instance).

__For Nginx__

```bash
sudo setsebool -P httpd_can_network_connect=1
sudo setsebool -P httpd_can_network_connect_db=1
sudo setsebool -P httpd_execmem=1
sudo setsebool -P httpd_use_nfs 1
```
![Screenshot 2024-12-08 061721](https://github.com/user-attachments/assets/455a3801-8646-4b60-97d3-a65d34b315b8)
__NB: Repeat the step above for Webservers__


### Install Amazon EFS utils for mounting the targets on the Elastic file system (Nginx and Webserver).

__For Nginx__

```bash
git clone https://github.com/aws/efs-utils

cd efs-utils
```
![Screenshot 2024-12-08 142518](https://github.com/user-attachments/assets/6dce3496-8935-428c-8cf2-56eddaf5c33e)
```bash
sudo yum install -y make
```
![Screenshot 2024-12-08 142533](https://github.com/user-attachments/assets/7bbab59e-9ba5-4d64-873b-ac1456984cb4)
```bash
sudo yum install -y rpm-build
```
