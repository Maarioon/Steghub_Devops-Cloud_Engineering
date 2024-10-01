# DevOps Tooling Website Solution

## Introduction

__This project involves implementation of a solution that consists of the following components:__

- Infrastructure: AWS
- Web Server Linux: Red Hat Enterprise Linux 9
- Database Server: Ubuntu Linux + MySQL
- Sotrage Server: Red Hat Enterprise Linux 9 + NFS Server
- Programming Language: PHP
- Code Repository: GitHub

 Launching the Web Server (EC2 Instance)
Create EC2 Instance
Go to the AWS Management Console and launch a new EC2 instance.
Select Redhat and Ubuntu 20.04 as the AMI.
Choose an instance type (t2.micro for free tier).
Configure Security Groups to allow:
HTTP (Port 80)
HTTPS (Port 443)
SSH (Port 22)
Launch the instance and download the key pair for SSH access.
Install Web Server (Nginx/Apache)
Once the EC2 instance is running, SSH into it

## Step 1 - Prepare NFS Server

__1.__ __Spin up an EC2 instance with RHEL Operating System__

![NFS](./images/ec2-nfs-detail.png)

__2.__ __Configure Logical volume management on the server__

- Format the lvm as xfs
- Create 3 Logical volumes: lv-opt, lv-appa, lv-logs.
- Create mount points on /mnt directory for the logical volumes as follows:
  - Mount lv-apps on /mnt/apps - To be used by web servers
  - Mount lv-logs on /mnt/logs - To be used by web serveer logs
  - Mount lv-opt on /mnt/opt - To be used by Jenkins server in next project.

  #### Use ```lsblk``` to inspect what block devices are attached to the server. All devices in Linux reside in /dev/ directory. Inspect with ```ls /dev/``` and ensure all 3 newly created devices are there. Their name will likely be ```xvdf```, ```xvdg``` and ```xvdh```

```
lsblk
```
#### Use ```gdisk``` utility to create a single partition on each of the 3 disks

```
sudo gdisk /dev/xvdf
```
```
sudo gdisk /dev/xvdg
```

```
sudo gdisk /dev/xvdh
```
```
lsblk
```

![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/32e85bc4da60d8745b4448b2be4993dc1fb6d307/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-29%20050424.png)

![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/32e85bc4da60d8745b4448b2be4993dc1fb6d307/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-29%20064116.png)

![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/32e85bc4da60d8745b4448b2be4993dc1fb6d307/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-29%20065716.png)

![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/32e85bc4da60d8745b4448b2be4993dc1fb6d307/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-29%20070107.png)

![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/32e85bc4da60d8745b4448b2be4993dc1fb6d307/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-29%20070135.png)

![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/32e85bc4da60d8745b4448b2be4993dc1fb6d307/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-29%20083148.png)

![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/32e85bc4da60d8745b4448b2be4993dc1fb6d307/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-29%20083202.png)

#### Install ```lvm``` package

```
sudo yum install lvm2 -y
```
![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/32e85bc4da60d8745b4448b2be4993dc1fb6d307/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-29%20083214.png)

#### Use ```pvcreate``` utility to mark each of the 3 dicks as physical volumes (PVs) to be used by LVM. Verify that each of the volumes have been created successfully

```
sudo pvcreate /dev/xvdf1 /dev/xvdg1 /dev/xvdh1
sudo pvs
```
![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/32e85bc4da60d8745b4448b2be4993dc1fb6d307/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-29%20083404.png)

#### Use ```vgcreate``` utility to add all 3 PVs to a volume group (VG). Name the VG ```webdata-vg```. Verify that the VG has been created successfully

```
sudo vgcreate webdata-vg /dev/xvdf1 /dev/xvdg1 /dev/xvdh1
sudo vgs
```

![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/32e85bc4da60d8745b4448b2be4993dc1fb6d307/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-29%20083439.png)

#### Use ```lvcreate``` utility to create 3 logical volume, ```lv-apps```, ```lv-logs``` and ```lv-opt```. Verify that the logical volumes have been created successfully

```
sudo lvcreate -n lv-apps -L 9G webdata-vg
sudo lvcreate -n lv-logs -L 9G webdata-vg
sudo lvcreate -n lv-opt -L 9G webdata-vg

sudo lvs
```

![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/32e85bc4da60d8745b4448b2be4993dc1fb6d307/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-29%20095317.png)

#### Verify the entire setup

```
sudo vgdisplay -v   #view complete setup, VG, PV and LV
```
![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/32e85bc4da60d8745b4448b2be4993dc1fb6d307/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-29%20095317.png)

```
lsblk
```
![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/32e85bc4da60d8745b4448b2be4993dc1fb6d307/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-29%20095351.png)

![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/32e85bc4da60d8745b4448b2be4993dc1fb6d307/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-29%20100412.png)

#### Use ```mkfs -t xfs``` to format the logical volumes instead of ext4 filesystem

```
sudo mkfs -t xfs /dev/webdata-vg/lv-apps
sudo mkfs -t xfs /dev/webdata-vg/lv-logs
sudo mkfs -t xfs /dev/webdata-vg/lv-opt
```
![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/32e85bc4da60d8745b4448b2be4993dc1fb6d307/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-29%20100814.png)

![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/32e85bc4da60d8745b4448b2be4993dc1fb6d307/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-29%20100412.png)

#### Create mount point on ```/mnt``` directory

```
sudo mkdir /mnt/apps
sudo mkdir /mnt/logs
sudo mkdir /mnt/opt
```

![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/32e85bc4da60d8745b4448b2be4993dc1fb6d307/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-29%20100814.png)

```
sudo mount /dev/webdata-vg/lv-apps /mnt/apps
sudo mount /dev/webdata-vg/lv-logs /mnt/logs
sudo mount /dev/webdata-vg/lv-opt /mnt/opt
```

![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/32e85bc4da60d8745b4448b2be4993dc1fb6d307/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-29%20095410.png)

__3.__ __Install NFS Server, configure it to start on reboot and ensure it is up and running__.

```
sudo yum update -y
sudo yum install nfs-utils -y
```

![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/32e85bc4da60d8745b4448b2be4993dc1fb6d307/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-29%20101309.png)

__3.__ __Install NFS Server, configure it to start on reboot and ensure it is up and running__.

```
sudo yum update -y
sudo yum install nfs-utils -y
```

![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/32e85bc4da60d8745b4448b2be4993dc1fb6d307/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-29%20101309.png)

![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/32e85bc4da60d8745b4448b2be4993dc1fb6d307/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-29%20101335.png)

```
sudo systemctl start nfs-server.service
sudo systemctl enable nfs-server.service
sudo systemctl status nfs-server.service
```

![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/32e85bc4da60d8745b4448b2be4993dc1fb6d307/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-29%20101420.png_

![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/32e85bc4da60d8745b4448b2be4993dc1fb6d307/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-29%20101500.png)

_4.__ __Export the mounts for Webservers' ```subnet cidr```(IPv4 cidr) to connect as clients. For simplicity, all 3 Web Servers are installed in the same subnet but in production set up, each tier should be separated inside its own subnet or higher level of security__

#### Set up permission that will allow the Web Servers to read, write and execute files on NFS.

```
sudo chown -R nobody: /mnt/apps
sudo chown -R nobody: /mnt/logs
sudo chown -R nobody: /mnt/opt

sudo chmod -R 777 /mnt/apps
sudo chmod -R 777 /mnt/logs
sudo chmod -R 777 /mnt/opt

sudo systemctl restart nfs-server.service
```

![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/32e85bc4da60d8745b4448b2be4993dc1fb6d307/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-29%20103231.png)

![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/32e85bc4da60d8745b4448b2be4993dc1fb6d307/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-29%20103343.png)

![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/32e85bc4da60d8745b4448b2be4993dc1fb6d307/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-29%20103424.png)

![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/32e85bc4da60d8745b4448b2be4993dc1fb6d307/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-29%20103503.png)

#### Configure access to NFS for clients within the same subnet (example Subnet Cidr - 172.31.32.0/20)

```
sudo vi /etc/exports

/mnt/apps 172.31.0.0/20(rw,sync,no_all_squash,no_root_squash)
/mnt/logs 172.31.0.0/20(rw,sync,no_all_squash,no_root_squash)
/mnt/opt 172.31.0.0/20(rw,sync,no_all_squash,no_root_squash)

sudo exportfs -arv
```

![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/32e85bc4da60d8745b4448b2be4993dc1fb6d307/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-29%20103727.png)

![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/32e85bc4da60d8745b4448b2be4993dc1fb6d307/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-29%20103740.png)

![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/32e85bc4da60d8745b4448b2be4993dc1fb6d307/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-29%20103916.png)

![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/32e85bc4da60d8745b4448b2be4993dc1fb6d307/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-29%20104152.png)

__5.__ __Check which port is used by NFS and open it using the security group (add new inbound rule)__

```
rpcinfo -p | grep nfs
```

__Note__: For NFS Server to be accessible from the client, the following ports must be opened: TCP 111, UDP 111, UDP 2049, NFS 2049.
Set the Web Server subnet cidr as the source

![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/32e85bc4da60d8745b4448b2be4993dc1fb6d307/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-29%20104224.png)

## Step 2 - Configure the Database Server

#### Launch an Ubuntu EC2 instance that will have a role - DB Server

#### Access the instance to begin configuration.

```bash
ssh -i "my-devec2key.pem" ubuntu@18.116.87.242
```

#### Update and upgrade Ubuntu

```bash
sudo apt update && sudo apt upgrade -y
```

__1.__ __Install MySQL Server__

#### Install mysql server

```bash
sudo apt install mysql-server
```

![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/32e85bc4da60d8745b4448b2be4993dc1fb6d307/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-29%20123125.png)

#### Run mysql secure script

```bash
sudo mysql_secure_installation
```

![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/32e85bc4da60d8745b4448b2be4993dc1fb6d307/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-29%20123349.png)

__2.__ __Create a database and name it ```tooling```__

__3.__ __Create a database user and name it ```webaccess```__

__4.__ __Grant permission to ```webaccess``` user on ```tooling``` database to do anything only from the webservers ```subnet cidr```__

```sql
sudo mysql

CREATE DATABASE tooling;
CREATE USER 'webaccess'@'yourip' IDENTIFIED WITH mysql_native_password BY 'yourpassword';
GRANT ALL PRIVILEGES ON tooling.* TO 'webaccess'@'yourip' WITH GRANT OPTION;
FLUSH PRIVILEGES;
show databases;

use tooling;
select host, user from mysql.user;
exit
```

#### Set Bind Address and restart MySQL

```bash
sudo vi /etc/mysql/mysql.conf.d/mysqld.cnf

sudo systemctl restart mysql
sudo systemctl status mysql
```

![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/32e85bc4da60d8745b4448b2be4993dc1fb6d307/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-29%20124542.png)

![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/32e85bc4da60d8745b4448b2be4993dc1fb6d307/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-29%20124834.png)

![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/32e85bc4da60d8745b4448b2be4993dc1fb6d307/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-29%20124843.png)

![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/32e85bc4da60d8745b4448b2be4993dc1fb6d307/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-29%20124849.png)

#### Open MySQL port 3306 on the DB Server EC2.

Access to the DB Server is allowed only from the ```Subnet Cidr``` configured as source.

![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/32e85bc4da60d8745b4448b2be4993dc1fb6d307/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-29%20132704.png)

## Step 3 - Prepare the Web Servers

There is need to ensure that the Web Servers can serve the same content from a shared storage solution, in this case - NFS and MySQL database. One DB can be accessed for ```read``` and ```write``` by multiple clients.
For storing shared files that the Web Servers will use, NFS is utilized and previousely created Logical Volume ```lv-apps``` is mounted to the folder where Apache stores files to be served to the users (/var/www).

This approach makes the Web server ```stateless``` which means they can be replaced when needed and data (in the database and on NFS) integrtity is preserved

In further steps, the following was done:
- Configured NFS (This step was done on all 3 servers)
- Deployed a tooling application to the Web Servers into a shared NFS folder
- Configured the Web Server to work with a single MySQL database

#### Web Server 1

__1.__ __Launch a new EC2 instance with RHEL Operating System_

__2.__ __Install NFS Client__

```
sudo yum install nfs-utils nfs4-acl-tools -y
```

__3.__ __Mount ```/var/www/``` and target the NFS server's export for ```apps```__.
NFS Server private IP address = yournfsip

```
sudo mkdir /var/www
sudo mount -t nfs -o rw,nosuid 172.31.1.209:/mnt/apps /var/www
```

__4.__ __Verify that NFS was mounted successfully by running ```df -h```. Ensure that the changes will persist after reboot.__

```
sudo vi /etc/fstab
```

![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/32e85bc4da60d8745b4448b2be4993dc1fb6d307/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-29%20130658.png)

![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/32e85bc4da60d8745b4448b2be4993dc1fb6d307/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-29%20132231.png)

![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/32e85bc4da60d8745b4448b2be4993dc1fb6d307/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-29%20132649.png)

Add the following line
```
yournfsip:/mnt/apps /var/www nfs defaults 0 0
```
![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/32e85bc4da60d8745b4448b2be4993dc1fb6d307/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-29%20132704.png)

__5.__ __Install Remi's repoeitory, Apache and PHP__

```
sudo yum install httpd -y
```

```
sudo dnf install https://dl.fedoraproject.org/pub/epel/epel-release-latest-9.noarch.rpm
```

```
sudo dnf install dnf-utils http://rpms.remirepo.net/enterprise/remi-release-9.rpm
```

```
sudo dnf module reset php
```

```
sudo dnf module enable php:remi-8.2
```

```
sudo dnf install php php-opcache php-gd php-curl php-mysqlnd
```

```
sudo systemctl start php-fpm
sudo systemctl enable php-fpm
sudo systemctl status php-fpm

sudo setsebool -P httpd_execmem 1  # Allows the Apache HTTP server (httpd) to execute memory that it can also write to. This is often needed for certain types of dynamic content and applications that may need to generate and execute code at runtime.
sudo setsebool -P httpd_can_network_connect=1   # Allows the Apache HTTP server to make network connections to other servers.
sudo setsebool -P httpd_can_network_connect_db=1  # allows the Apache HTTP server to connect to remote database servers.
```

![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/32e85bc4da60d8745b4448b2be4993dc1fb6d307/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-29%20132833.png)

![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/32e85bc4da60d8745b4448b2be4993dc1fb6d307/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-29%20132931.png)

![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/32e85bc4da60d8745b4448b2be4993dc1fb6d307/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-29%20133430.png)

![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/32e85bc4da60d8745b4448b2be4993dc1fb6d307/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-29%20134409.png)

![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/32e85bc4da60d8745b4448b2be4993dc1fb6d307/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-29%20134651.png)

![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/32e85bc4da60d8745b4448b2be4993dc1fb6d307/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-29%20152040.png)

![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/32e85bc4da60d8745b4448b2be4993dc1fb6d307/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-29%20152630.png)


### Web Server 2

__1.__ __Launch another new EC2 instance with RHEL Operating System__

__2.__ __Install NFS Client__

```
sudo yum install nfs-utils nfs4-acl-tools -y
```

__3.__ __Mount ```/var/www/``` and target the NFS server's export for ```apps```__.
NFS Server private IP address = yourip

```
sudo mkdir /var/www
sudo mount -t nfs -o rw,nosuid nfsip:/mnt/apps /var/www
```

```
sudo vi /etc/fstab
```

Add the following line
```bash
yournfsip:/mnt/apps /var/www nfs defaults 0 0
```
__4.__ __Verify that NFS was mounted successfully by running ```df -h```. Ensure that the changes will persist after reboot.__

![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/41cac3f832990ad83274145f220d9288bcc17372/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-29%20152821.png)

![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/41cac3f832990ad83274145f220d9288bcc17372/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-29%20153530.png)

![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/41cac3f832990ad83274145f220d9288bcc17372/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-29%20153543.png)

(![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/41cac3f832990ad83274145f220d9288bcc17372/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-29%20153554.png)

(![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/41cac3f832990ad83274145f220d9288bcc17372/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-29%20154523.png)

### Web Server 3

__1.__ __Launch another new EC2 instance with RHEL Operating System__

__2.__ __Install NFS Client__

```
sudo yum install nfs-utils nfs4-acl-tools -y
```

__3.__ __Mount ```/var/www/``` and target the NFS server's export for ```apps```__.
NFS Server private IP address = 172.31.1.209

```
sudo mkdir /var/www
sudo mount -t nfs -o rw,nosuid 172.31.1.209:/mnt/apps /var/www
```

__4.__ __Verify that NFS was mounted successfully by running ```df -h```. Ensure that the changes will persist after reboot.__

```
sudo vi /etc/fstab
```

Add the following line
```
172.31.1.209:/mnt/apps /var/www nfs defaults 0 0
```

__5.__ __Install Remi's repoeitory, Apache and PHP__

```
sudo yum install httpd -y
```

```
sudo dnf install https://dl.fedoraproject.org/pub/epel/epel-release-latest-9.noarch.rpm
```

```
sudo dnf install dnf-utils http://rpms.remirepo.net/enterprise/remi-release-9.rpm
```

```
sudo dnf module reset php
```

```
sudo dnf module enable php:remi-8.2
```

```
sudo dnf install php php-opcache php-gd php-curl php-mysqlnd
```

```
sudo systemctl start php-fpm
sudo systemctl enable php-fpm
sudo systemctl status php-fpm
sudo setsebool -P httpd_execmem 1
```

(![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/41cac3f832990ad83274145f220d9288bcc17372/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-29%20165017.png)

(![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/41cac3f832990ad83274145f220d9288bcc17372/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-29%20165055.png)

(![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/41cac3f832990ad83274145f220d9288bcc17372/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-29%20170224.png)

(![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/41cac3f832990ad83274145f220d9288bcc17372/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-29%20182722.png)

(![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/41cac3f832990ad83274145f220d9288bcc17372/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-29%20182743.png)

(![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/41cac3f832990ad83274145f220d9288bcc17372/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-29%20183116.png)

(![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/41cac3f832990ad83274145f220d9288bcc17372/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-29%20183129.png)

(![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/41cac3f832990ad83274145f220d9288bcc17372/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-29%20183201.png)

(![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/41cac3f832990ad83274145f220d9288bcc17372/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-30%20075212.png)

__6.__ __Verify that Apache files and directories are availabel on the Web Servers in ```/var/www``` and also on the NFS Server in ```/mnt/apps```. If the same files are present in both, it means NFS was mounted correctly.__
test.txt file was created from Web Server 1, and it was accessible from Web Server 2.

(![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/41cac3f832990ad83274145f220d9288bcc17372/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-29%20152630.png)


__8.__ __Fork the tooling source code from ```StegHub GitHub Account```__

(![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/41cac3f832990ad83274145f220d9288bcc17372/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-30%20101731.png)

__9.__ __Deploy the tooling Website's code to the Web Server. Ensure that the ```html``` folder from the repository is deplyed to ```/var/www/html```__

#### Install Git

(![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/41cac3f832990ad83274145f220d9288bcc17372/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-30%20101746.png)

#### Initialize the directory and clone the tooling repository

Ensure to clone the forked repository

(![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/41cac3f832990ad83274145f220d9288bcc17372/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-30%20103027.png)

__Note__:
Acces the website on a browser

- Ensure TCP port 80 is open on the Web Server.
- If ```403 Error``` occur, check permissions to the ```/var/www/html``` folder and also disable ```SELinux```
  
```
sudo setenforce 0
```
To make the change permanent, open selinux file and set selinux to disable.

```
sudo vi /etc/sysconfig/selinux

SELINUX=disabled

sudo systemctl restart httpd
```
(![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/41cac3f832990ad83274145f220d9288bcc17372/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-30%20114235.png)

__10.__ __Update the website's configuration to connect to the database (in ```/var/www/html/function.php``` file). Apply ```tooling-db.sql``` command__
```sudo mysql -h <db-private-IP> -u <db-username> -p <db-password < tooling-db.sql```

```
sudo vi /var/www/html/functions.php
```

(![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/41cac3f832990ad83274145f220d9288bcc17372/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-30%20114235.png)

```sql
sudo mysql -h dbip -u webaccess -p tooling < tooling-db.sql
```

(![image alt](

#### Access the database server from Web Server

```sql
sudo mysql -h dbip -u webaccess -p
```

(![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/41cac3f832990ad83274145f220d9288bcc17372/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-30%20125830.png)

__11.__ __Create in MyQSL a new admin user with username: ```myuser``` and password: ```password```__

```sql
INSERT INTO users(id, username, password, email, user_type, status) VALUES (2, 'myuser', '5f4dcc3b5aa765d61d8327deb882cf99', 'user@mail.com', 'admin', '1');
```

(![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/41cac3f832990ad83274145f220d9288bcc17372/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-30%20130109.png)


__12.__ __Open a browser and access the website using the Web Server public IP address ```http://<Web-Server-public-IP-address>/index.php```. Ensure login into the website with ```myuser``` user.__

#### From Web Server 1

(![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/41cac3f832990ad83274145f220d9288bcc17372/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-30%20130310.png)

### From Web Server 2

__Disable SELinux__

```
sudo setenforce 0

SELINUX=disabled
```

(![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/41cac3f832990ad83274145f220d9288bcc17372/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-30%20131048.png)

__Access the website__

(![image alt](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/41cac3f832990ad83274145f220d9288bcc17372/DevOps-Tooling-Website-Solution-103/images/Screenshot%202024-09-30%20132909.png)



