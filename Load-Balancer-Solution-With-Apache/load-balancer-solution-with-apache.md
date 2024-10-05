# Load Balancer Solution With Apache

This project implements a load-balancing solution using Apache HTTP Server. Load balancing is essential for distributing network traffic across multiple servers, ensuring high availability, reliability, and performance. This solution allows you to handle more requests efficiently by balancing the load between backend web servers.

This project links 3 different servers together After completing DevOps tooling website solution Project,After completing DevOps tooling website solution Project, having a user to access each of the webservers using 3 different IP addreses or 3 different DNS names or having 3 different servers doing exactly the same thing. When we access a website in the Internet we use an URL and we do not really know how many servers are out there serving our requests, this complexity is hidden from a regular user, but in case of websites that are being visited by millions of users per day (like Google or Reddit) it is impossible to serve all the users from a single Web Server (it is also applicable to databases, but for now we will not focus on distributed DBs).

## Prerequisites

Ensure that the following servers are installedd and configure already.

- Two RHEL9 Web Servers
- One MySQL DB Server (based on Ubuntu 24.04)
- One RHEL9 NFS Server

## Prerequisites Configurations

- Apache (httpd) is up and running on both Web Servers.
- ```/var/www``` directories of both Web Servers are mounted to ```/mnt/apps``` of the NFS Server.
- All neccessary TCP/UDP ports are opened on Web, DB and NFS Servers.
- Client browsers can access both Web Servers by their Public IP addresses or Public DNS names and can open the ```Tooling Website``` (e.g, ```http://<Public-IP-Address-or-Public-DNS-Name>/index.php```)

# Step 1 - Configure Apache As A Load Balancer

## 1. Create an Ubuntu Server 24.04 EC2 instance and name it Project-8-apache-lb

## 2. Open TCP port 80 on Project-8-apache-lb by creating an Inbounb Rule in Security Group

## 3. Instal Apache Load Balancer on Project-8-apache-lb and configure it to point traffic coming to LB to both Web Servers.

- Install Apache

```
sudo apt install apache2 -y
```

```
sudo apt-get install libxml2-dev
```

### ii. Enable the following modules

```
sudo a2enmod rewrite

sudo a2enmod  proxy

sudo a2enmod  proxy_balancer

sudo a2enmod  proxy_http

sudo a2enmod  headers

sudo a2enmod  lbmethod_bytraffic
```
![Screenshot 2024-10-05-062001](https://github.com/user-attachments/assets/e1c3d42d-23c0-41ad-a658-4b61e40abcb3)

### iii. Restart Apache2 Service

```
sudo systemctl restart apache2
sudo systemctl status apache2
```

![Screenshot 2024-10-05-060712](https://github.com/user-attachments/assets/74249ed1-9675-4690-a3b1-92227dd84ee4)

## Configure Load Balancing

### i. Open the file 000-default.conf in sites-available

```
sudo vi /etc/apache2/sites-available/000-default.conf
```
### ii. Add this configuration into the section ```<VirtualHost *:80>  </VirtualHost>```

```apache
<Proxy “balancer://mycluster”>
            BalancerMember http://172.31.46.91:80 loadfactor=5 timeout=1
           BalancerMember http://172.31.43.221:80 loadfactor=5 timeout=1
           ProxySet lbmethod=bytraffic
           # ProxySet lbmethod=byrequests
</Proxy>


ProxyPreserveHost on
ProxyPass / balancer://mycluster/
ProxyPassReverse / balancer://mycluster/
```
![Screenshot 2024-10-05-061931](https://github.com/user-attachments/assets/57cd7185-b426-4dc0-929f-0a80377defef)


### iii. Restart Apache

```
sudo systemctl restart apache2
```


```bytraffic``` balancing method with distribute incoming load between the Web Servers according to currentraffic load. The proportion in which traffic must be distributed can be controlled bt ```loadfactor``` parameter.

Other methods such as ```bybusyness```, ```byrequests```, ```heartbeat``` can also be adopted.


## 4. Verify that the configuration works

### i. Access the website using the LB's Public IP address or the Public DNS name from a browser
__Note__: If in the previous project, ```/var/log/httpd``` was mounted from the Web Server to the NFS Server, unmount them and ensure that each Web Servers has its own log directory.

![Screenshot 2024-10-05-062024](https://github.com/user-attachments/assets/471b23d5-0b6f-4cf9-91ea-a84982522a71)
![Screenshot 2024-10-05-060910](https://github.com/user-attachments/assets/2c41b63e-66f3-43b9-9be8-619ddb062422)

### Open the hosts file

```
sudo vi /etc/hosts
```
![Screenshot 2024-10-05-062058](https://github.com/user-attachments/assets/ce4d445d-cc94-4490-925b-139819f1a7a6)

### Add two records into file with Local IP address and arbitrary name for the Web Servers

by traffic balancing method will distribute incoming load between your Web Servers according to current traffic load. We can control in which proportion the traffic must be distributed by loadfactor parameter.

![Screenshot 2024-10-05-062058](https://github.com/user-attachments/assets/7fc025df-25fc-4218-8e36-94736f6572fb)

#### Accessing the LoadBlanacer Through Public Ips.

```
http://13.233.152.48/login.php
```

Accessing the page via credential.
![Screenshot 2024-10-05-61426](https://github.com/user-attachments/assets/8c40a6f5-7a2e-4645-a79b-e17fbaa88dfd)

these credentials we're made in via sshing into the database

![Screenshot 2024-10-05-061010](https://github.com/user-attachments/assets/0c56133f-c842-495f-81f9-7b2c771bf42c)
![Screenshot 2024-10-05-060957](https://github.com/user-attachments/assets/0bdc707e-5cbf-4df0-b984-ae847e8a213c)
![Screenshot 2024-10-05-060947](https://github.com/user-attachments/assets/266e750c-ebab-4ef4-980d-5f4051fb7548)
![Screenshot 2024-10-05-060940](https://github.com/user-attachments/assets/7c1b98b4-0cb6-4172-a674-c8fe484ced3b)


