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
you may decide to create all at once or create them imdividually
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
![Screenshot 2024-12-08 142641](https://github.com/user-attachments/assets/23934d76-e9f1-4e44-92ed-f4d758fa9405)
```bash
# openssl-devel is needed by amazon-efs-utils-2.0.4-1.el9.x86_64
sudo yum install openssl-devel -y
```
```bash
# Cargo command needs to be installed as it is necessary for building the Rust project included in the source.
sudo yum install cargo -y
```
![Screenshot 2024-12-08 144530](https://github.com/user-attachments/assets/b60664b3-eb03-49bb-a119-0ac0397dba0f)
```bash
sudo make rpm
```
![Screenshot 2024-12-08 144825](https://github.com/user-attachments/assets/dbdc65cd-d1f2-498f-8c8f-711d44350a89)
```bash
sudo yum install -y  ./build/amazon-efs-utils*rpm
```
![Screenshot 2024-12-08 145220](https://github.com/user-attachments/assets/e935f2e7-0a9a-48d8-af30-5dc3a65edc7a)

__Repeat the steps above for Webservers__
We are using an ACM (Amazon Certificate Manager) certificate for both our external and internal load balancers.
But for some reasons, we might want to add a self-signed certificate:

- __Compliance Requirements:__
  - Certain industry regulations and standards (e.g., PCI DSS, HIPAA) require end-to-end encryption, including between internal load balancers and backend servers (within a private network).

- __Defense in Depth:__
  - Adding another layer of security by encrypting traffic between internal load balancers and web servers can provide additional protection.

When generating the certificate, In the common name, enter the private IPv4 dns of the instance (for Webserver and Nginx). We use the certificate by specifying the path to the file fnc.crt and fnc.key in the nginx configuration.

## Set up self-signed certificate for the nginx instance

```bash
sudo mkdir /etc/ssl/private

sudo chmod 700 /etc/ssl/private

sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/fnc.key -out /etc/ssl/certs/fnc.crt
```
![Screenshot 2024-12-08 200004](https://github.com/user-attachments/assets/50d35136-ae7a-4e54-ba86-6f61cdef3a41)
```bash
sudo openssl dhparam -out /etc/ssl/certs/dhparam.pem 2048
```
![Screenshot 2024-12-08 203550](https://github.com/user-attachments/assets/697ac805-0605-44f4-b206-f9b0da2808d7)
## Set up self-signed certificate for the Apache Webserver instance

```bash
sudo yum install -y mod_ssl
```
```bash
sudo openssl req -newkey rsa:2048 -nodes -keyout /etc/pki/tls/private/fnc.key -x509 -days 365 -out /etc/pki/tls/certs/fnc.crt
```
```bash
# Edit the ssl.conf to conform with the key and crt file created.
sudo vim /etc/httpd/conf.d/ssl.conf
```
![Screenshot 2024-12-08 203835](https://github.com/user-attachments/assets/4f90068d-197e-4f1b-ac43-ceb35bef7a7d)
![Screenshot 2024-12-08 203749](https://github.com/user-attachments/assets/41730a99-9e4b-4cbc-9a8e-1ed0317fa005)
![Screenshot 2024-12-08 204802](https://github.com/user-attachments/assets/36187c9a-2e2f-42a4-8808-84ce95c94245)
![Screenshot 2024-12-08 204748](https://github.com/user-attachments/assets/b616259b-bd8d-424c-a6b2-75936bb1a13b)
![Screenshot 2024-12-08 204518](https://github.com/user-attachments/assets/40accbdb-3bad-4c33-8065-090df48c55fc)
## [Create an AMI](https://docs.aws.amazon.com/toolkit-for-visual-studio/latest/user-guide/tkv-create-ami-from-instance.html) out of the EC2 instances

On the EC2 instance page, Go to Actions > Image and templates > Create image

__For Bastion AMI__
![Screenshot 2024-12-08 205529](https://github.com/user-attachments/assets/c04a917b-e1b8-4ec2-bc22-92c760364e58)
![Screenshot 2024-12-08 205658](https://github.com/user-attachments/assets/c9582a92-d159-4c09-9d84-3ec1c37cb912)

__For Nginx AMI__
![Screenshot 2024-12-08 205643](https://github.com/user-attachments/assets/3d57a512-ccaa-495a-b851-962cc3179320)
__For Webservers AMI__
![Screenshot 2024-12-08 205750](https://github.com/user-attachments/assets/311f4776-8857-469f-aa85-1fa8b111091c)

__All AMIs__
![Screenshot 2024-12-08 205844](https://github.com/user-attachments/assets/493541da-d154-432d-ac75-84bf5ffb4da2)
## CONFIGURE TARGET GROUPS

Create Target groups for Nginx, Worpress and Tooling

__For Nginx Target Group__
![Screenshot 2024-12-08 210100](https://github.com/user-attachments/assets/aa1a2bfc-53b9-4b46-b171-9d736e297dd4)
![Screenshot 2024-12-08 205946](https://github.com/user-attachments/assets/e70a9b2e-25ff-4741-993b-f029d1451004)
![Screenshot 2024-12-08 205935](https://github.com/user-attachments/assets/caa0bb77-0462-478a-bce7-912412bafe0d)
__For Wordpress Target Group__
![Screenshot 2024-12-09 003114](https://github.com/user-attachments/assets/0733503b-b8f4-4021-8eeb-b48e52566f70)
__For Tooling Target Group__

![Screenshot 2024-12-09 003311](https://github.com/user-attachments/assets/18d11ce5-c770-4bae-9341-02562560619a)
![Screenshot 2024-12-09 003459](https://github.com/user-attachments/assets/0e283dd9-fd9e-43cc-8dd3-9a8ebf5347fb)

# Configure Application Load Balancer (ALB)

### External Application Load Balancer To Route Traffic To NGINX

Nginx EC2 Instances will have configurations that accepts incoming traffic only from Load Balancers. No request should go directly to Nginx servers. With this kind of setup, we will benefit from intelligent routing of requests from the ALB to Nginx servers across the 2 Availability Zones. We will also be able to [offload](https://avinetworks.com/glossary/ssl-offload/) SSL/TLS certificates on the ALB instead of Nginx. Therefore, Nginx will be able to perform faster since it will not require extra compute resources to valifate certificates for every request.

1. Create an Internet facing ALB
2. Ensure that it listens on HTTPS protocol (TCP port 443)
3. Ensure the ALB is created within the appropriate VPC | AZ | Subnets
4. Choose the Certificate from ACM
5. Select Security Group
6. Select Nginx Instances as the target group
![Screenshot 2024-12-09 004536](https://github.com/user-attachments/assets/e3a6272d-820f-480f-9950-9775c94a566b)
![Screenshot 2024-12-09 004333](https://github.com/user-attachments/assets/b4657bd6-c94f-424b-8d7b-b634f06734f2)
![Screenshot 2024-12-09 003836](https://github.com/user-attachments/assets/ea3b2617-dbbf-4676-9588-10345e844d1e)
![Screenshot 2024-12-09 003808](https://github.com/user-attachments/assets/def274de-59b0-4c7a-990d-dc62cd2b8f45)
![Screenshot 2024-12-09 004547](https://github.com/user-attachments/assets/fcdfd865-e8d2-455b-b5d9-7fd5713ede3b)
### Application Load Balancer To Route Traffic To Webservers

Since the webservers are configured for auto-scaling, there is going to be a problem if servers get dynamically scalled out or in. Nginx will not know about the new IP addresses, or the ones that get removed. Hence, Nginx will not know where to direct the traffic.

To solve this problem, we must use a load balancer. But this time, it will be an internal load balancer. Not Internet facing since the webservers are within a private subnet, and we do not want direct access to them.

1. Create an Internal ALB
2. Ensure that it listens on HTTPS protocol (TCP port 443)
3. Ensure the ALB is created within the appropriate VPC | AZ | Subnets
4. Choose the Certificate from ACM
5. Select Security Group
6. Select webserver Instances as the target group
7. Ensure that health check passes for the target group

__NOTE:__ This process must be repeated for both WordPress and Tooling websites.
![Screenshot 2024-12-09 005122](https://github.com/user-attachments/assets/11726b2b-b874-4899-92c9-23abae712a85)
![Screenshot 2024-12-09 005057](https://github.com/user-attachments/assets/05047cdc-061d-4672-a04a-6b803d8f7e4c)
![Screenshot 2024-12-09 005231](https://github.com/user-attachments/assets/0b338fdf-34a9-4238-a170-bde6750ffbed)
![Screenshot 2024-12-09 005217](https://github.com/user-attachments/assets/16441d46-ea5f-488a-a61f-fdeb97f7675c)
The default target configured on the listener while creating the internal load balancer is to forward traffic to wordpress on port 443. Hence, we need to create a rule to route traffic to tooling as well.

1.	Select internal load balancer from the list of load balancers created:
	-	Choose the load balancer where you want to add the rule.
2.	Listeners Tab:
	-	Click on the Listeners tab.
	-	Select the listener (HTTPS:443) and click Manage listener.
3.	Add Rules:
	-	Click on Add rule.
4.	Configure the Rule:
	-	Give the rule a name and click next.
	-	Add a condition by selecting `Host header`.
	-	Enter the `hostnames` for which you want to route traffic. (tooling.com and www.tooling.com).
	-	Choose the appropriate target group for the `hostname`.
![Screenshot 2024-12-09 010155](https://github.com/user-attachments/assets/bd3a2121-20d1-429d-bf43-e525b2cbc996)
![Screenshot 2024-12-09 010124](https://github.com/user-attachments/assets/69d7e952-2f7c-42b5-ab08-2f9186b974b7)
![Screenshot 2024-12-09 010049](https://github.com/user-attachments/assets/efae4c41-ebed-44fa-b2ca-05b0370c1e24)
![Screenshot 2024-12-09 005442](https://github.com/user-attachments/assets/4251069a-74ed-41c9-8c2c-2cf0de4abd84)
![Screenshot 2024-12-09 010241](https://github.com/user-attachments/assets/941f4b72-6820-44a3-a9c8-cdf957edc19d)
## PREPARE LAUNCH TEMPLATE FOR NGINX (ONE PER SUBNET)

1. Make use of the AMI to set up a launch template
2. Ensure the Instances are launched into a public subnet.
3. Assign appropriate security group.
4. Configure [Userdata](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/user-data.html) to update yum package repository and install nginx.
Ensure to `enable auto-assign public IP` in the Advance Network Configuration
![Screenshot 2024-12-09 010606](https://github.com/user-attachments/assets/248cb1f2-868e-4cb5-b054-cc64a7c944d8)
![Screenshot 2024-12-09 010522](https://github.com/user-attachments/assets/bae37793-b0d0-4a87-9e52-9b015543703e)
![Screenshot 2024-12-09 010806](https://github.com/user-attachments/assets/6920cdab-2934-47a3-94e6-dc1fb907b27c)
![Screenshot 2024-12-09 044737](https://github.com/user-attachments/assets/8ed96f69-dc19-46c9-a4d3-0e73f4af313d)

__Repeat the same setting for Bastion, the difference here is the userdata input, AMI and security group__.
![Screenshot 2024-12-09 050357](https://github.com/user-attachments/assets/5205b54a-691a-41ba-9b00-62e23b836045)
![Screenshot 2024-12-09 050506](https://github.com/user-attachments/assets/15d566b8-3f63-41fd-be61-b61f82317f19)
![Screenshot 2024-12-09 050427](https://github.com/user-attachments/assets/82c5ad36-0c22-4bd1-80c7-cecf58edb60e)

### Wordpress Userdata

NB: Both Wordpress and Tooling make use of Webserver AMI.

Update the mount point to the file system, this should be done on access points for tooling and wordpress respectively.

NB: Both Wordpress and Tooling make use of Webserver AMI.

Update the mount point to the file system, this should be done on access points for tooling and wordpress respectively.
`sudo mount -t efs -o tls,accesspoint=fsap-0a05d5cb95059314c fs-01bb3fe22fdd61691:/ /var/www/`
The RDS end point is also needed
```
mkdir /var/www/

sudo mount -t efs -o tls,accesspoint=fsap-0b018d904b0fc7c04 fs-0d2abcf9777f93f56:/ /var/www/


yum install -y httpd
systemctl start httpd
systemctl enable httpd

yum module reset php -y
yum module enable php:remi-7.4 -y

yum install -y php php-common php-mbstring php-opcache php-intl php-xml php-gd php-curl php-mysqlnd php-fpm php-json

systemctl start php-fpm
systemctl enable php-fpm

wget http://wordpress.org/latest.tar.gz

tar xzvf latest.tar.gz
rm -rf latest.tar.gz

cp wordpress/wp-config-sample.php wordpress/wp-config.php
mkdir /var/www/html/
cp -R /wordpress/* /var/www/html/
cd /var/www/html/
touch healthstatus

sed -i "s/localhost/techeon-db.czw0c2uys7jo.us-east-1.rds.amazonaws.com/g" wp-config.php
sed -i "s/username_here/adminr/g" wp-config.php
sed -i "s/password_here/Opeoluwa1./g" wp-config.php
sed -i "s/database_name_here/techeon-db/g" wp-config.php

chcon -t httpd_sys_rw_content_t /var/www/html/ -R

systemctl restart httpd


```

### Tooling userdata

```
#!/bin/bash
mkdir /var/www/

sudo mount -t efs -o tls,accesspoint=fsap-0a05d5cb95059314c fs-01bb3fe22fdd61691:/ /var/www/

yum install -y httpd
systemctl start httpd
systemctl enable httpd

yum module reset php -y
yum module enable php:remi-7.4 -y

yum install -y php php-common php-mbstring php-opcache php-intl php-xml php-gd php-curl php-mysqlnd php-fpm php-json

systemctl start php-fpm
systemctl enable php-fpm

git clone https://github.com/Maarioon/techeon-tooling2

mkdir /var/www/html
sudo cp -R /tooling/html/*  /var/www/html/
cd /tooling2

mysql -h techeon-db.czw0c2uys7jo.us-east-1.rds.amazonaws.com -u admin -p Opeoluwa1.  toolingdb < tooling-db.sql

cd /var/www/html/
touch healthstatus

sed -i "s/$db = mysqli_connect('mysql.tooling.svc.cluster.local', 'admin', 'admin', 'tooling');/$db = mysqli_connect('techeon-db.czw0c2uys7jo.us-east-1.rds.amazonaws.com', 'admin', 'Opeoluwa1.', 'toolingdb');/g" functions.php

chcon -t httpd_sys_rw_content_t /var/www/html/ -R

mv /etc/httpd/conf.d/welcome.conf /etc/httpd/conf.d/welcome.conf_backup

systemctl restart httpd
sudo systemctl status httpd

```
![Screenshot 2024-12-09 044737](https://github.com/user-attachments/assets/28f3d197-8238-4930-a50d-b070be488c56)
![Screenshot 2024-12-09 044800](https://github.com/user-attachments/assets/df63e2dc-34a3-4f83-b4e7-3bf993d9b1e0)

## CONFIGURE AUTOSCALING FOR NGINX

1. Select the right launch template
2. Select the VPC
3. Select both public subnets
4. Enable Application Load Balancer for the AutoScalingGroup (ASG)
5. Select the target group you created before
6. Ensure that you have health checks for both EC2 and ALB
7. The desired capacity is 2
8. Minimum capacity is 2
9. Maximum capacity is 4
10. Set [scale out](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-lifecycle.html) if CPU utilization reaches 90%
11. Ensure there is an [SNS](https://docs.aws.amazon.com/sns/latest/dg/welcome.html) topic to send scaling notifications
### Create Auto Scaling Group for Bastion
![Screenshot 2024-12-09 050506](https://github.com/user-attachments/assets/0f425b1d-1d17-489d-b7e1-42414db53927)
![Screenshot 2024-12-09 050427](https://github.com/user-attachments/assets/8cff1e06-810d-426e-81da-9d773ff85b25)
![Screenshot 2024-12-09 050357](https://github.com/user-attachments/assets/5a0ccd05-421f-45ca-a623-dad4e771c25b)
![Screenshot 2024-12-09 050744](https://github.com/user-attachments/assets/b21f31bb-e949-466a-8d25-b9a65b04f54f)
![Screenshot 2024-12-09 051241](https://github.com/user-attachments/assets/8b829602-0ead-4358-a712-ed051d79b518)
__Access RDS through Bastion connection to craete database for wordpress and tooling.__

 Copy the RDS endpoint to be used as host
![Screenshot 2024-12-09 054217](https://github.com/user-attachments/assets/e9fa9745-20ae-46cb-8700-84e79350127c)
### Create Auto Scaling Group for Nginx
![Screenshot 2024-12-09 054541](https://github.com/user-attachments/assets/95a15bc4-8642-4637-b912-3b6f18ff829a)
![Screenshot 2024-12-09 054527](https://github.com/user-attachments/assets/6888ab6d-b1bd-4df6-95f3-4e4eec98cb36)
![Screenshot 2024-12-09 054512](https://github.com/user-attachments/assets/dc25f010-9b9e-4319-a9a2-51962deb421e)
![Screenshot 2024-12-09 054433](https://github.com/user-attachments/assets/1804d956-e1a0-4b73-a448-dc0ba4eb763d)
![Screenshot 2024-12-09 054413](https://github.com/user-attachments/assets/3f36c715-f7c5-47e3-8915-8ce5d042ec78)
![Screenshot 2024-12-09 054347](https://github.com/user-attachments/assets/7f5f1de9-0ba6-4efe-80c1-bb379e9fd05f)
![Screenshot 2024-12-09 054310](https://github.com/user-attachments/assets/fb4886cc-c8a6-4bc4-9f65-999784fc3933)
![Screenshot 2024-12-09 054636](https://github.com/user-attachments/assets/b42e53dc-c6e6-4d92-97e1-d51717c1b2ff)
### Repeat the Nginx Auto Scaling Group steps above for Wordpress and Tooling with their right launch template

All Auto Scaling Groups
![Screenshot 2024-12-09 064807](https://github.com/user-attachments/assets/fc393b6a-960e-4ed2-a1d2-59b9a29adade)

# Configuring DNS with Route53

Earlier in this project we registered a free domain with `Cloudns` and configured a hosted zone in [Route53](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/Welcome.html). But that is not all that needs to be done as far as `DNS` configuration is concerned.

We need to ensure that the main domain for the WordPress website can be reached, and the subdomain for Tooling website can also be reached using a browser.

Create other records such as [CNAME, alias and A records](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/route-53-concepts.html).

NOTE: You can use either CNAME or alias records to achieve the same thing. But alias record has better functionality because it is a faster to resolve DNS record, and can coexist with other records on that name. Read [here](https://support.dnsimple.com/articles/differences-between-a-cname-alias-url/#:~:text=The%20A%20record%20maps%20a,a%20name%20to%20another%20name.&text=The%20ALIAS%20record%20maps%20a,the%20HTTP%20301%20status%20code) to get to know more about the differences.

- Create an alias record for the root domain and direct its traffic to the ALB DNS name.
- Create an alias record for `tooling.fncloud.dns-dynamic.net` and direct its traffic to the ALB DNS name.
![Screenshot 2024-12-09 065413](https://github.com/user-attachments/assets/806bc693-1f0e-4f52-b022-7a378e0077ec)
![Screenshot 2024-12-09 065212](https://github.com/user-attachments/assets/2ebd07a0-702b-4f8e-a14f-b9e85e321be5)
![Screenshot 2024-12-09 065506](https://github.com/user-attachments/assets/9a560f7f-d7b0-4971-a1d3-a95ad5b5e1a1)
### Ensure that health check passes for the target groups
do it for all target group
![Screenshot 2024-12-09 065638](https://github.com/user-attachments/assets/9049e872-911e-4a70-92ec-fa586c4bfde2)
__Let's access our wordpress website__
![Screenshot 2024-12-09 134324](https://github.com/user-attachments/assets/8b1f0b6a-25e4-466c-a2cb-4ba3c7590b38)
![Screenshot 2024-12-09 134306](https://github.com/user-attachments/assets/cc3eeeae-0c3a-4d51-9a20-80229e3000d2)
![Screenshot 2024-12-09 133421](https://github.com/user-attachments/assets/dedd0a10-65c4-4313-ba4a-bfa76ee58d58)

We have just created a secured, scalable and cost-effective infrastructure to host 2 enterprise websites using various Cloud services from AWS. At this point, our infrastructure is ready to host real websites' load.
