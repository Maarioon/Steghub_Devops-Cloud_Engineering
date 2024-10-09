# Load Balancer Solution With Nginx and SSL/TLS

A Load Balancer (LB) distributes clients' requests among underlying Web Servers and makes sure that the load is distributed in an optimal way.
In this project, we will configure a Load Balancer Solution.

It is extremely important to ensure that connections to our Web Solutions are secure and information is encrypted in transit

## Task
This project consist of two parts:
1. Configure Nginx as a Load Balancer
2. Register a new domain name and configure secure connection

# Part 1 - Configure Nginx As A Load Balancer

 ### 1. Create an EC2 VM based on Ubuntu Server 24.04 LTS and name it nginx LB

 __Open TCP port 80 for HTTP connections and TCP port 443 for secured HTTPS connections__

### 2. Update ``/etc/hosts`` file for local DNS with Web Servers' names (e.g ``web1`` and ``web2``) and their local IP addresses

__Access the instance__

### 3. Install and configure Nginx as a load balancer to point traffic to the resolvable DNS names of the webservers

__Update the instance__

```bash
sudo apt update && sudo apt upgrade -y
```
![Screenshot 2024-10-08 042100](https://github.com/user-attachments/assets/dc419ad3-5245-4c9a-9f48-9a7cfc9e9a96)


__Install Nginx__

```bash
sudo apt install nginx
```
![Screenshot 2024-10-08 042122](https://github.com/user-attachments/assets/73d3b052-fe55-42cb-b356-2643780c8b31)

### 4. Configure Nginx LB using the Web Servers' name defined in /etc/hosts

__Open the default Nginx configuration file__

```bash
sudo vi /etc/nginx/nginx.conf
```
![Screenshot 2024-10-08 051449](https://github.com/user-attachments/assets/e4ca1f78-e954-4748-8368-6425c8e39070)

__Insert the following configuration in http section__

```nginx
    upstream myproject {
       server Web1 weight=5;
       server Web2 weight=5;
    }

    server {
        listen 80;
        server_name ww.domain.com;

        location / {
            proxy_pass http://myproject;
        }
    }
    # comment out this line
    # include /ete/nginx/sites-enabled/
```

![Screenshot 2024-10-08 051543](https://github.com/user-attachments/assets/ee793dd6-9486-462f-beb9-5144b2de0cc7)


__Test the server configuration__

```bash
sudo nginx -t
```

__Restart Nginx and ensure the service is up and running__

```bash
sudo systemctl restart nginx
sudo systemctl status nginx
```
![Screenshot 2024-10-08 051735](https://github.com/user-attachments/assets/742004f5-d3f6-47e1-9706-fe3065d1c466)

# Part 2 - Register a new domain name and configure secured connection using SSL/TLS certificates

In order to get a valid SSL certificate we need to register a new domain name, we can do it using any Domain name registrar - a company that manages reservation of domain names. The most popular ones are: [Godaddy.com](https://www.godaddy.com/en-uk), [Domain.com](https://www.domain.com/), [Bluehost.com](https://www.bluehost.com/).

### 1. Register a new domain name with any registrar of your choice in any domain zone. (e.g .com, .net, .org, .edu, info, .xyz or any other)

(https://my.noip.com/dynamic-dns?mode=add)is the domain name registrar used for this project.

![Screenshot 2024-10-08 172027](https://github.com/user-attachments/assets/12baa915-44b0-4847-a79b-709c25d0f770)


### 2. Assign an Elastic IP to our Nginx LB server and associate our domain name with this Elastic IP

This is neccessary in order to have a static IP address that does not change after reboot.

__Associate the elastic IP with Nginx LB__

### 3. Update or create A record your registrar to point to Nginx LB using the elastic IP

![Screenshot 2024-10-08 180321](https://github.com/user-attachments/assets/12f8e480-40ec-40c8-8447-80a986609956)

__Use [nds checker](https://dnschecker.org/#A/www.toolingsolution.dns-dynamic.net) to Verify the DNS record__

![Screenshot 2024-10-08 180343](https://github.com/user-attachments/assets/b488458b-cb5b-4166-84aa-3c979a28497e)

### 4. Configure Nginx to recognize your new domain name

Update your ``nginx.conf`` with ``server_name www.<your-domain-name.com`` instead of ``server_name www.domain.com``

In our case, the server_name is ``yourdomainname.anything``
![Screenshot 2024-10-08 172027](https://github.com/user-attachments/assets/ffa63a79-aaf5-4207-88ad-60349c58b017)


```bash
sudo vi /etc/nginx/nginx.conf
```

![Screenshot 2024-10-08 051735](https://github.com/user-attachments/assets/8662454e-39c5-4fb2-bbde-f57c386888f0)
![Screenshot 2024-10-08 051608](https://github.com/user-attachments/assets/9600b5d6-9fa6-4a2a-9486-c8318ecdbfc8)


__Restart Nginx__

```bash
sudo systemctl restart nginx
```
![Screenshot 2024-10-08 051735](https://github.com/user-attachments/assets/06cda77e-8f70-43dd-9395-d19bbd0969d6)


__Check that the Web Server can be reach from a browser with the new domain name using HTTP protocol__.

```bash
http://<your-domain-name.com>
```
![Screenshot 2024-10-08 172027](https://github.com/user-attachments/assets/5be1e064-4c4f-46a4-a350-c4c2836024cd)


### 5. Install [certbot](https://certbot.eff.org/) and request for an SSL/TLS certificate

__Ensure [snapd](https://snapcraft.io/snapd) service is active and running__

```bash
sudo systemctl status snapd
```

![Screenshot 2024-10-08 165857](https://github.com/user-attachments/assets/c4ac0c30-09fb-49c7-8a53-013e2bf8c74e)

__Install certbot__

```bash
sudo snap install --classic certbot

```
![Screenshot 2024-10-08 173945](https://github.com/user-attachments/assets/aac1dd1b-6d17-4f71-a7a6-2ef6fcd6f47c)


### Request SSL/TLS Certificate

__Create a Symlink in `/usr/bin` for Certbot__: Place a symbolic link in this `PATH` to make it easier to run `certbot` from the `command line` without needing to specify its full path.

```bash
sudo ln -s /snap/bin/certbot /usr/bin/certbot
```
Follow the certbot instructions you will need to choose which domain you want your certificate to be issued for, domain name will be looked up from `nginx.conf` file so ensure you have updated it on step 4.

```bash
sudo certbot --nginx  # Obtain certificate
```
![Screenshot 2024-10-08 170107](https://github.com/user-attachments/assets/e7ed5542-3bb8-48dc-829a-f20b35e530fc)

### Test secured access to your Web Solution by trying to reach `https://<your-domain-name.com>`.

You shall be able to access your wesite using HTTPS protocol (Uses `TCP port 443`) and see a padlock image in your browsers' search string. `Click on the padlock icon` and you can see the detail of the certificate issued for the website.

![Screenshot 2024-10-08 175023](https://github.com/user-attachments/assets/5ce66a26-b10f-434f-84f5-041cfbd60ddb)
![Screenshot 2024-10-08 175110](https://github.com/user-attachments/assets/acbbdadf-da82-45d9-afea-5dc0916150e4)
![Screenshot 2024-10-08 175121](https://github.com/user-attachments/assets/04a9a688-57ad-457c-95b2-cf9841bc6806)

### 6. Set up periodical renewal of your SSL/TLS certificate

By default, `LetsEncrypt` certificate is valid for 90 days, so it is recommended to renew it at least every 60 days or more frequently.

__Test the renewal command in `dry-run` mode__

```bash
sudo certbot renew --dry-run
```
![Screenshot 2024-10-08 175419](https://github.com/user-attachments/assets/ee69e7f3-8d5b-4df6-aea3-3ab11f51fd73)


__Best pracice is to have a scheduled job that runs `renew` command periodically. Configure a `cronjob` to run the command twice a day__

__Edit the `crontab` file__

```bash
crontab -e
```
![Screenshot 2024-10-08 180115](https://github.com/user-attachments/assets/6b825ea1-1732-4161-bc23-ce5eae0b0eda)

__Add the following line to scheduled a job that runs renew command twice daily__

```bash
* */12 * * *   root /usr/bin/certbot renew > /dev/null 2>&1
```
![Screenshot 2024-10-08 193101](https://github.com/user-attachments/assets/a3490951-c304-4010-86f9-2cea2949a18c)


You can always change the interval of the cronjob if twice a day is too often by adjusting the schedule expression.

Resources on cron configuration:
![Screenshot 2024-10-08 193101](https://github.com/user-attachments/assets/bef58317-9c9e-4de2-b52f-8fb3a30268e0)


