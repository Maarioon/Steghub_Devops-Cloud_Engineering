# Web Solution With WordPress

## Step 1 - Prepare a Web Server
What is a WordPress Website?

What is a WordPress websiteA Word Press site is a specialized type of website that makes adding and changing your content, like words, photos, and blog posts easy. It is driven with the help of some tools:

Apache: Undo all your visitors who want to visit your website.

PHP: This is what WordPress uses to run and nice things it does.

MySQL (MariaDB) : Think of this as a giant notebook where WordPress stores everything important, such as your blog posts and settings.

Why Are We Using These Tools?

It is what shows your website to people when they visit your site, therefore apache configuration is important.

WordPress and Apache make your website run, and WordPress can talk to Apache through PHP.

This is what all the data of WordPress is stored in, known as MySQL.


__1.__ __Launch a RedHat EC2 instance that serve as ```Web Server```. Create 3 volumes in the same AZ as the web server ec2 each of 10GB and attache all 3 volumes one by one to the web server__.

![Instance detail](./images/instance-created.png)

![Instance ebs volumes](./images/created-ebs1.png)

![ebs volumes](./images/created-ebs2.png)

_2.__ __Open up the Linux terminal to begin configuration__.

```
sudo yum update && sudo yum upgrade
```

![web update](./images/updating-server.png)

![web update](./images/updating-server2.png)

__3.__ __Use ```lsblk``` to inspect what block devices are attached to the server. All devices in Linux reside in /dev/ directory. Inspect with ```ls /dev/``` and ensure all 3 newly created devices are there. Their name will likely be ```xvdf```, ```xvdg``` and ```xvdh```__.

```
lsblk
```
![List Block- lsblk](./images/lsblk-mounted-volumns.png)

__4.__ __Use ```df -h``` to see all mounts and free space on the server__.

```
df -h
```
![df -h](./images/df-h1.png)

_5a.__ __Use ```gdisk``` utility to create a single partition on each of the 3 disks__.
click on 'n' for new partition and when you see another prompt, click on 'w' to write and confrm all changes made

```
sudo gdisk /dev/xvdf
sudo gdisk /dev/xvdg
sudo gdisk /dev/xvdh
```
![partition](./images/partition1.png)

![partition](./images/partition2.png)

![partition](./images/partition3.png)

__5b.__ __Use ```lsblk``` utility to view the newly configured partitions on each of the 3 disks__
```
lsblk
```
![View partitions](./images/lsblk2.png)

__6.__ __Install ```lvm``` package__
```
sudo yum install lvm2 -y
```
![Install lvm](./images/instal-lvm.png)

then run lvmdisk scan

```
sudo lvmdiskscan
```
![Install lvm](./images/lvmdiskscan.png)

__7.__ __Use ```pvcreate``` utility to mark each of the 3 dicks as physical volumes (PVs) to be used by LVM. Verify that each of the volumes have been created successfully__.

```
sudo pvcreate /dev/xvdf1 /dev/xvdg1 /dev/xvdh1

sudo pvs
```
![PV-create](./images/pvcreate.png)

__8.__ __Use ```vgcreate``` utility to add all 3 PVs to a volume group (VG). Name the VG ```webdata-vg```. Verify that the VG has been created successfully__

```
sudo vgcreate webdata-vg /dev/xvdf1 /dev/xvdg1 /dev/xvdh1

sudo vgs
```
![VG-create](./images/vgcreate-webdata.png)

__9.__ __Use ```lvcreate``` utility to create 2 logical volume, ```apps-lv``` (__Use half of the PV size__), and ```logs-lv``` (__Use the remaining space of the PV size__). Verify that the logical volumes have been created successfully__.

__Note__: apps-lv is used to store data for the Website while logs-lv is used to store data for logs.

```
sudo lvcreate -n apps-lv -L 14G webdata-vg

sudo lvcreate -n logs-lv -L 14G webdata-vg

sudo lvs
```
![LV](./images/llvcreate-logs.png)

__10a.__ __Verify the entire setup__
```
sudo vgdisplay -v   #view complete setup, VG, PV and LV
```
![VG display](./images/vg-display.png)

```
lsblk
```
![List Block lsblk](./images/lsblk2.png)

__10b.__ __Use ```mkfs.ext4``` to format the logical volumes with ext4 filesystem__

```bash
sudo mkfs.ext4 /dev/webdata-vg/apps-lv

sudo mkfs.ext4 /dev/webdata-vg/logs-lv
```
![filesystem](./images/apps-UUID.png)

__11.__ __Create ```/var/www/html``` directory to store website files and ```/home/recovery/logs``` to store backup of log data__
```bash
sudo mkdir -p /var/www/html

sudo mkdir -p /home/recovery/logs
```
#### Mount /var/www/html on apps-lv logical volume
```bash
sudo mount /dev/webdata-vg/apps-lv /var/www/html
```
![Mount apps-lv](./images/mount-applv.png)

__12.__ __Use ```rsync``` utility to backup all the files in the log directory ```/var/log``` into ```/home/recovery/logs``` (This is required before mounting the file system)__

```
sudo rsync -av /var/log /home/recovery/logs
```
![Back logs](./images/rysnc-av.png)

__12.__ __Use ```rsync``` utility to backup all the files in the log directory ```/var/log``` into ```/home/recovery/logs``` (This is required before mounting the file system)__

```
sudo rsync -av /var/log /home/recovery/logs
```
![Back logs](./images/df-h-mounted.png)

__13.__ __Mount ```/var/log``` on ```logs-lv``` logical volume (All existing data on /var/log is deleted with this mount process which was why the data was backed up)__

```
sudo mount /dev/webdata-vg/logs-lv /var/log
```
__8.__ __Use ```mkfs.ext4``` to format the logical volumes with ext4 filesystem and monut ```/db``` on ```db-lv```__

```
sudo mkfs.ext4 /dev/database-vg/db-lv
```
```
sudo mount /dev/database-vg/db-lv /db
```
![Mount logs-lv](./images/df-h-mounted.png)

__14.__ __Restore log file back into ```/var/log``` directory__
```
sudo rsync -av /home/recovery/logs/log/ /var/log
```

__15.__ __Update ```/etc/fstab``` file so that the mount configuration will persist after restart of the server__)

#### Get the ```UUID``` of the device and Update the ```/etc/fstab``` file with the format shown inside the file using the ```UUID```. Remember to remove the leading and ending quotes.
```
sudo blkid   # To fetch the UUID

sudo vi /etc/fstab
```
![Update fstab](./images/apps-UUID2.png)

__16.__ __Test the configuration and reload daemon. Verify the setup__
```
sudo mount -a   # Test the configuration

sudo systemctl daemon-reload

df -h   # Verifies the setup
```
![Verify setup](./images/daemon-reload.png)


## Step 2 - Prepare the Database Server

### Launch a second RedHat EC2 instance that will have a role - ```DB Server```. Repeat the same steps as for the Web Server, but instead of ```apps-lv```, create ```dv-lv``` and mount it to ```/db``` directory.
follow the same process for apps, server one, instaead of apps create a db aserver and create a db diirectory to save the server

![DB Server](./images/Screenshot 2024-09-24 170524.png)


## Step 3 - Install WordPress on the Web Server EC2

__1.__ __Update the repository__
```
sudo yum -y update
```

__2.__ __Install wget, Apache and it's dependencies__

```
sudo yum wget httpd php-fpm php-json
```
![Install Apache](./images/install-httpd.png)

__3.__ __Install the latest version of PHP and it's dependencies using the Remi repository__

#### Install the EPEL repository
The package manager ```dnf``` was used here.
It generally offers better performance and more efficient dependency resolution.
```dnf``` is the modern, actively maintained package manager, while yum is older and gradually being phased out.

#### The system version of the RHEL EC2 is version "9"

```
sudo dnf install https://dl.fedoraproject.org/pub/epel/epel-release-latest-9.noarch.rpm
```
![Install Epel repo](./images/install-php.png)

#### Install yum utils and enable remi-repository

```
sudo dnf install dnf-utils http://rpms.remirepo.net/enterprise/remi-release-9.rpm
```
![Install yum utils](./images/install-yum-utilities2.png)

![Install yum utils](./images/install-yum-utilities.png)

#### After the successful installation of yum-utils and Remi-packages, search for the PHP modules which are available for download by running the command.

```
sudo dnf module list php
```
![List PHP versions](./images/https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/42ec42efe46d2a2756b074fd4c2d64c9d8a990a5/web-solution-with-wordpress/images/Screenshot%202024-09-25%20172404.png)

#### The output above indicates that if the currently installed version of PHP is PHP 8.1, there is need to install the newer release, PHP 8.2. Reset the PHP modules.

```
sudo dnf module reset php
```
![Reset PHP](./images/https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/42ec42efe46d2a2756b074fd4c2d64c9d8a990a5/web-solution-with-wordpress/images/Screenshot%202024-09-25%20172417.png)

#### Having run reset, enable the PHP 8.2 module by running

```
sudo dnf module enable php:remi-8.2
```
![enable PHP](./images/Screenshot 2024-09-25 180155.png)

![enable PHP](./images/enable-php2.png)

#### Install PHP, PHP-FPM (FastCGI Process Manager) and associated PHP modules using the command.

```
sudo dnf install php php-opcache php-gd php-curl php-mysqlnd
```
![Install PHP](./images/install-php.png)

#### To verify the version installed to run.

```
php -v
```
![PHP version](./images/install-php.png)

#### Start, enable and check status of PHP-FPM on boot-up.

```
sudo systemctl start php-fpm
sudo systemctl enable php-fpm
sudo systemctl status php-fpm
```
![enable php-fpm](./images/enable-php2.png)

__4.__ __Configure SELinux Policies__

To instruct SELinux to allow Apache to execute the PHP code via PHP-FPM run.

```
sudo chown -R apache:apache /var/www/html
sudo chcon -t httpd_sys_rw_content_t /var/www/html -R
sudo setsebool -P httpd_execmem 1
sudo setsebool -P httpd_can_network_connect=1
sudo setsebool -P httpd_can_network_connect_db=1
```
![permissions](./images/https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/42ec42efe46d2a2756b074fd4c2d64c9d8a990a5/web-solution-with-wordpress/images/Screenshot%202024-09-25%20180553.png)

####  Restart Apache web server for PHP to work with Apache web server.

```
sudo systemctl restart httpd
```
![Restart httpd](./images/restart-httpd.png)

__5.__ __Download WordPress__

Download wordpress and copy wordpress content to /var/www/html

```
sudo mkdir wordpress && cd wordpress
sudo wget http://wordpress.org/latest.tar.gz
sudo tar xzvf latest.tar.gz   # Extract wordpress
```
![Download wordpress](./images/wordpress-http-ta-file.png)

#### After extraction, ```cd``` into the extracted ```wordpress``` and ```Copy``` the content of ```wp-config-sample.php``` to ```wp-config.php```.

This will copy and create the file wp-config.php

```
cd wordpress/
sudo cp -R wp-config-sample.php wp-config.php
```
![wp-config](./images/wordpress-http-ta-file.png)

#### Exit from the extracted ```wordpress```. Copy the content of the extracted ```wordpress``` to ```/var/www/html```.

```
cd ..
sudo cp -R wordpress/. /var/www/html/
```

![Cp /html](./images/cp-wordpress.png)

![Cp /html](./images/wordpress-http-ta-file.png)


__6.__ __Install MySQL on DB Server EC2__

#### Update the EC2
```
sudo yum update -y
```
![Update RHEL](./images/update-rhel-db.png)

#### Install MySQL Server
```
sudo yum install mysql-server -y
```
![install mysqlserver](./images/rpm-mysql.png)

#### Verify that the service is up and running. If it is not running, restart the service and enable it so it will be running even after reboot.

```
sudo systemctl start mysqld
sudo systemctl enable mysqld
sudo systemctl status mysqld
```
![Start mysqld](./images/restart-mysql.png)

#### Create database

The user "wordpress" will be connecting to the database using the Web Server __private IP address__

```
sudo mysql -u root -p

CREATE DATABASE wordpress_db;
CREATE USER 'wordpress'@'172.31.31.27' IDENTIFIED WITH mysql_native_password BY 'Admin123$';
GRANT ALL PRIVILEGES ON wordpress_db.* TO 'wordpress'@'172.31.31.27' WITH GRANT OPTION;
FLUSH PRIVILEGES;
show databases;
exit
```

![Create db](./images/create-database.png)

![show db](./images/show-database.png)

#### Set the bind address

The bind address is set to the ```private IP address of the DB Server``` for more security instead of to any IP address (0.0.0.0)

```
sudo vi /etc/my.cnf
sudo systemctl restart mysqld
```
![bind address](./images/bind-address.png)

#### Open ```wp-config.php``` file and edit the database information

```
cd /var/www/html
sudo vi wp-config.php
sudo systemctl restart httpd
```

![Open cofig](./images/www.conf-file.png)

The ```private IP address``` of the DB Server is set as the ```DB_HOST``` because the DB Server and the Web Server resides in the same ```subnet``` which makes it possible for them to communicate directly. The private IP address is not an internet routable address.

![Edit config](./images/www.conf-file.png)


#### Connect to the DB Server from the Web Server

```bash
sudo mysql -h yourip -u wordpress -p

show databases;
exit;
```
![Web to DB](./images/wordpress-entry-page.png)


#### Access the web page again with the Web Server public IP address and install wordpress on the browser

![wp installed](./images/word-press-websirte.png)
![wp login](./images/wordpress-login-page.png)
![wp website](./images/wordpress-register-page.png)
![wp website](./images/wordpress-website2.png)
![wp website](./images/wordpress-website3.png)
![wp website](./images/wordpress-webste2.png)


## At this point, your fully built wordpress website is ready. the implementation of this project is complete and WordPress is available to be used.


