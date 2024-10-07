
# Tooling Website Deployment with Jenkins
Jenkins is an open-source automation server that helps automate tasks related to building, testing, and deploying software.
Use in Context: Jenkins is used to automate the deployment of your website and manage the integration of code from GitHub through continuous integration/continuous deployment (CI/CD).


### Step 1: Set Up Jenkins on an EC2 Instance
![Screenshot 2024-10-07 053458](https://github.com/user-attachments/assets/ecf80a44-dfdd-4a73-8eb6-a33195aad319)
![Screenshot 2024-10-06 145156](https://github.com/user-attachments/assets/594f40b3-cabb-4f6c-aba3-03a62d512e58)


1. **Create an AWS EC2 server** based on ![Screenshot 2024-10-07 052545](https://github.com/user-attachments/assets/0acd7d46-b448-4721-a6eb-e8281ad10fb2)
Ubuntu Server 20.04 LTS and name it "Jenkins".

2. **Install JDK** (since Jenkins is a Java-based application):
   ```bash
   sudo apt update
   sudo apt install default-jdk-headless
   ```

3. **Install Jenkins**:
   ```bash
   wget -q -O - https://pkg.jenkins.io/debian-stable/jenkins.io.key | sudo apt-key add -
   sudo sh -c 'echo deb https://pkg.jenkins.io/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list'
   sudo apt update
   sudo apt-get install jenkins
   ```
![Screenshot 2024-10-06 154349](https://github.com/user-attachments/assets/0a7c9dde-ebf6-4368-b1d0-3ffd90c7faae)
![Screenshot 2024-10-06 154224](https://github.com/user-attachments/assets/dca0fd9e-ea34-48e4-9378-73285e5ef229)

4. **Ensure Jenkins is running**:
   ```bash
   sudo systemctl status jenkins
   ```
![Screenshot 2024-10-06 160331](https://github.com/user-attachments/assets/dd0e1ebe-f83d-4416-bf07-5d4cfb4d7814)
![Screenshot 2024-10-06 160107](https://github.com/user-attachments/assets/751a486b-5bb6-42cd-9176-e45af385b09a)

5. **Open TCP port 8080** by creating a new Inbound Rule in your EC2 Security Group, as Jenkins uses this port.

6. **Perform initial Jenkins setup**:
   - Access Jenkins from your browser at `http://<Jenkins-Server-Public-IP-Address-or-Public-DNS-Name>:8080`.
   - Retrieve the default admin password using:
     ```bash
     sudo cat /var/lib/jenkins/secrets/initialAdminPassword
     ```
   - Install suggested plugins and create an admin user.

Jenkins installation is now complete!
![Screenshot 2024-10-06 161343](https://github.com/user-attachments/assets/eca749f8-c343-4d9b-8635-77bfe2ac048e)
![Screenshot 2024-10-06 161102](https://github.com/user-attachments/assets/9935f23a-669b-47cd-99f0-1665c89e0795)
![Screenshot 2024-10-06 161035](https://github.com/user-attachments/assets/c6647164-4f1d-4675-af5e-7409c7990810)
![Screenshot 2024-10-06 161007](https://github.com/user-attachments/assets/fb09b33e-518b-4b81-a47e-81cb020b3a0c)
![Screenshot 2024-10-06 160922](https://github.com/user-attachments/assets/a23adbfa-24dc-4270-a3b7-4c4951493ac3)
![Screenshot 2024-10-06 160745](https://github.com/user-attachments/assets/423a0aae-85a9-41ba-9c5e-ede61766901c)

### Step 2: Configure Jenkins to Retrieve Source Code from GitHub Using Webhooks

1. **Enable webhooks** in your GitHub repository settings.

2. In Jenkins, go to **New Item** and create a **Freestyle project**.

3. **Connect to your GitHub repository**:
   - In the project configuration, choose **Git repository** and provide the repository URL.
   - Add credentials (GitHub username and password) for access.

4. **Run the build manually**:
   - Click **Build Now**. If everything is configured correctly, the build will succeed.
   - Check the **Console Output** for build details.

5. **Configure automated builds**:
   - In the job configuration, set up triggering from GitHub webhooks.
   - Add **Post-build Actions** to archive the build files (artifacts).

6. **Test webhook**:
   - Make changes in your GitHub repository (e.g., modify `README.md`), and push to the master branch.
   - A new Jenkins build should automatically start, triggered by the webhook.
![Screenshot 2024-10-06 194823](https://github.com/user-attachments/assets/100fc695-abf2-4f7b-b1bf-aa23b9d9f45c)
![Screenshot 2024-10-06 194723](https://github.com/user-attachments/assets/69c5f318-95be-4449-bea8-6e376fc85b2a)
![Screenshot 2024-10-06 193158](https://github.com/user-attachments/assets/14c4e69d-1dd6-4bf5-a3cf-823d0fcb5d78)
![Screenshot 2024-10-06 193055](https://github.com/user-attachments/assets/95536191-dd53-4a4c-b15b-1194c687cb0e)
![Screenshot 2024-10-06 183118](https://github.com/user-attachments/assets/6c477016-1475-46dc-adaf-fa5e357e0744)
![Screenshot 2024-10-06 181953](https://github.com/user-attachments/assets/9894affc-2cb9-4f00-9702-8934b172586b)

By default, artifacts are stored locally on the Jenkins server at:
```bash
ls /var/lib/jenkins/jobs/tooling_github/builds/<build_number>/archive/
```

### Step 3: Configure Jenkins to Copy Files to NFS Server via SSH

Now that artifacts are saved locally, the next step is to copy them to your NFS server in the `/mnt/apps` directory.

1. **Install "Publish Over SSH" plugin**:
   - Go to **Manage Jenkins** > **Manage Plugins**.
   - In the **Available** tab, search for and install the "Publish Over SSH" plugin.

2. **Configure SSH connection**:
   - Go to **Manage Jenkins** > **Configure System**.
   - Scroll to the "Publish over SSH" section and configure:
     - **Private key**: Provide the `.pem` file for connecting to your NFS server.
     - **Arbitrary name**: Name your server (e.g., `NFS_Server`).
     - **Hostname**: Private IP address of the NFS server.
     - **Username**: `ec2-user` (for EC2-based NFS servers with RHEL 8).
     - **Remote directory**: `/mnt/apps`.

   Ensure TCP port 22 is open on your NFS server for SSH connections.

3. **Add a Post-build Action**:
   - In your Jenkins job configuration, add another **Post-build Action** to send files to the NFS server.
   - Set the action to copy all files (`**`) to the remote directory `/mnt/apps`.

4. **Test the setup**:
   - Make changes in your GitHub repository, triggering a new build via webhook.
   - In the **Console Output**, you should see:
     ```
     SSH: Transferred 25 file(s)
     Finished: SUCCESS
     ```
![Uploading Screenshot 2024-10-07 052545.png…]()
![Screenshot 2024-10-07 050334](https://github.com/user-attachments/assets/f9ebc27c-cbce-4bb0-bba8-8b61406f5174)
![Screenshot 2024-10-07 050230](https://github.com/user-attachments/assets/38a79a6c-ba94-4139-80fa-d07a26788d7a)
![Screenshot 2024-10-07 045742](https://github.com/user-attachments/assets/92158a50-feb0-4088-bf43-7b82d8eb9f2b)
![Screenshot 2024-10-07 045726](https://github.com/user-attachments/assets/30408c94-5cf2-45ff-a559-0a53e93aeffd)
![Screenshot 2024-10-06 214859](https://github.com/user-attachments/assets/5b2265dc-018d-4309-8c33-8b5500624ba7)
![Screenshot 2024-10-06 213328](https://github.com/user-attachments/assets/92d3f29d-259a-45ec-b228-d2539e7dfa5d)
![Screenshot 2024-10-06 213319](https://github.com/user-attachments/assets/c211e809-045d-4992-ae04-38fa49069fad)
![Screenshot 2024-10-06 212923](https://github.com/user-attachments/assets/6403a341-d4fa-494a-8928-44a4e69e9e53)
![Screenshot 2024-10-06 211838](https://github.com/user-attachments/assets/73fd1d94-9259-47cc-bb27-15015545a42f)
![Screenshot 2024-10-06 211654](https://github.com/user-attachments/assets/72bf4b54-1924-40ba-9fff-262c893de270)
![Screenshot 2024-10-06 210906](https://github.com/user-attachments/assets/09936677-ff21-4d9c-bbf9-f4aa9c8dae26)
![Screenshot 2024-10-06 210856](https://github.com/user-attachments/assets/5a4076a9-ada1-457a-a744-0bd62819e901)
![Screenshot 2024-10-06 194823](https://github.com/user-attachments/assets/e41d97aa-9d6d-4506-9f7a-0fa53235b6f4)
![Screenshot 2024-10-06 194723](https://github.com/user-attachments/assets/551eabcc-ba03-47c7-822b-72d348969166)

5. **Verify the files on NFS**:
   - SSH into your NFS server and check the files in `/mnt/apps`:
     ```bash
     cat /mnt/apps/README.md
     ```
   - If the changes you made in GitHub are present, the job works as expected.
![Screenshot 2024-10-07 053458](https://github.com/user-attachments/assets/ece0a60b-040a-4e5e-8815-5d4d37f5d47e)


