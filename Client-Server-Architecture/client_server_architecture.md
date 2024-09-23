# Task - Implement a Client Server Architecture using MySQL Database Management System (DBMS)

Client-side architecture is basically the way two computers, servers, applications talk to one another. In their communication, each machine has its own role: the machine sending requests is usually referred as "Client" and the machine responding (serving) is called "Server".

In this context, the "client" is typically a user's web browser or an application that interacts with a server to request . It can also be said that two or more computers are connected together over a network to send and receive requests between one another.resources, display information, and perform user interactions. Here’s a breakdown of what client-side architecture involves

![client-server example images](images/https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/8f47e9589de9c6e576b56fd09df7d3b66e8a037b/Client-Server-Architecture/images/Screenshot-2024-09-21-095055.png)


## The following instructions were followed to implement the above task:

### Step 1. Create and configure two linux-based virtual servers (EC2 instance in AWS)

_1.__ Two EC2 Instances of t2.micro type and Ubuntu 24.04 LTS (HVM) was lunched in the us-east-1 region using the AWS console.

__mysql server__

__mysql client__

__2.__ Attached SSH key named __my-ec2-key__ to access the instance on port 22


## Step 2 - On ```mysql server``` Linux Server, install MySQL Server software

__1.__ The private ssh key permission was changed for the private key file and then used to connect to the instance by running

![ec2 images](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/8f47e9589de9c6e576b56fd09df7d3b66e8a037b/Client-Server-Architecture/images/Screenshot%202024-09-21%20173341.png)

![ec2 images](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/8f47e9589de9c6e576b56fd09df7d3b66e8a037b/Client-Server-Architecture/images/Screenshot%202024-09-21%20173402.png)


## Step 3 - On ``` both client & server``` Linux Server, install MySQL Server & lient software

```
sudo apt update && sudo apt upgrade -y
```

__1.__ __Install MySQL Server software__

```
sudo apt install mysql-server -y
```

![Install server mysql](images/https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/8f47e9589de9c6e576b56fd09df7d3b66e8a037b/Client-Server-Architecture/images/Screenshot-2024-09-21-095055.png)

![Install server mysql](images/https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/8f47e9589de9c6e576b56fd09df7d3b66e8a037b/Client-Server-Architecture/images/Screenshot%202024-09-21%20101631.png)

__2.__ __Install MySQL Client software__

```
sudo apt install mysql-client -y
```

![Install client mysql](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/8f47e9589de9c6e576b56fd09df7d3b66e8a037b/Client-Server-Architecture/images/Screenshot%202024-09-21%20101741.png)

![Install client mysql](https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/8f47e9589de9c6e576b56fd09df7d3b66e8a037b/Client-Server-Architecture/images/Screenshot%202024-09-21%20101759.png)


__3.__ __Enable mysql server__

```
sudo systemctl enable mysql
```
![Enable mysql](images/https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/8f47e9589de9c6e576b56fd09df7d3b66e8a037b/Client-Server-Architecture/images/Screenshot%202024-09-21%20115953.png)

![Enable mysql](images/https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/8f47e9589de9c6e576b56fd09df7d3b66e8a037b/Client-Server-Architecture/images/Screenshot%202024-09-21%20120000.png)

__4.__ __configure mysqld server confg file__
You might need to configure MySQL server to allow connections from remote hosts.

```
sudo vi /etc/mysql/mysql.conf.d/mysqld.cnf 
```

Allow all traffic or specify ip address and ports you want to allow to access yoyu database

__5.__ __Now, configure MySQL server to allow connections from remote hosts__.

```
sudo vim /etc/mysql/mysql.conf.d/mysqld.cnf
```
Locate ```bind-address = 127.0.0.1```

Replace ```127.0.0.1``` with ```0.0.0.0```
```
[mysqld]
bind-address = 0.0.0.0
port = 3306
datadir = /var/lib/mysql
```

![configure mysql config file](images/https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/8f47e9589de9c6e576b56fd09df7d3b66e8a037b/Client-Server-Architecture/images/Screenshot%202024-09-21%20103515.png)

![[configure mysql config file](images/https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/8f47e9589de9c6e576b56fd09df7d3b66e8a037b/Client-Server-Architecture/images/Screenshot%202024-09-21%20103527.png)


## Step 4 - Configure MySQL server to allow connections from remote hosts.

__Befor the configuration stated above, the following were implemented:__

__1.__ Access MySQL shell__

```
sudo mysql
```
![mysql shell](images/https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/8f47e9589de9c6e576b56fd09df7d3b66e8a037b/Client-Server-Architecture/images/Screenshot%202024-09-21%20122114.png)

__2.__ On mysql server, create a user named ```your client``` and a database named ```your test_db```__.

```
CREATE USER 'client'@'%' IDENTIFIED WITH mysql_native_password BY 'User123$';

CREATE DATABASE test_db;

GRANT ALL ON test_db.* TO 'client'@'%' WITH GRANT OPTION;

FLUSH PRIVILEGES;
```

__Create table, insert rows into table and select from the table__

```
CREATE TABLE test_db.test_table (
  item_id INT AUTO_INCREMENT,
  content VARCHAR(255),
  PRIMARY KEY(item_id)
);

INSERT INTO test_db.test_table (content) VALUES ("My first choice football club is Chelsea");

INSERT INTO test_db.test_table (content) VALUES ("My second choice football club is R.Madrid");

SELECT * FROM test_db.test_table;
```

![DB](images/https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/8f47e9589de9c6e576b56fd09df7d3b66e8a037b/Client-Server-Architecture/images/Screenshot%202024-09-21%20123515.png)

![DB](images/https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/8f47e9589de9c6e576b56fd09df7d3b66e8a037b/Client-Server-Architecture/images/Screenshot%202024-09-21%20123541.png)

![DB](images/https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/8f47e9589de9c6e576b56fd09df7d3b66e8a037b/Client-Server-Architecture/images/Screenshot%202024-09-21%20131748.png)


## Step 5 - From ```mysql client``` Linxus Sever, connect remotely to ```mysql server``` Database Engine without using SSH. The mysql utility must be used to perform this action.

```
sudo mysql -u client -h yourip -p
```
![Client to DB](images/https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/8f47e9589de9c6e576b56fd09df7d3b66e8a037b/Client-Server-Architecture/images/Screenshot%202024-09-21%20155017.png)

## Step 6 - Check that the connection to the remote MySQL server was successfull and can perform SQL queries.

```
show databases;
```
![show db](images/https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/8f47e9589de9c6e576b56fd09df7d3b66e8a037b/Client-Server-Architecture/images/Screenshot%202024-09-21%20155051.png)

__Try to create something,create table, insert rows into table and select from the table__

```bash
CREATE TABLE test_db.test_table (
  item_id INT AUTO_INCREMENT,
  content VARCHAR(255),
  PRIMARY KEY(item_id)
);

INSERT INTO test_db.test_table (content) VALUES ("My first choice football club is Chelsea");

INSERT INTO test_db.test_table (content) VALUES ("My second choice football club is R.Madrid");

SELECT * FROM test_db.test_table;
```

![Query]((images/https://github.com/Maarioon/Steghub_Devops-Cloud_Engineering/blob/8f47e9589de9c6e576b56fd09df7d3b66e8a037b/Client-Server-Architecture/images/Screenshot%202024-09-21%20162216.png)


At this point, this project is successfully complete.
This deployment is a fully functional MySQL Client-Server set up.
