EXPERIENCE CONTINUOUS INTEGRATION WITH JENKINS | ANSIBLE | ARTIFACTORY | SONARQUBE | PHP

This project introduces foundational DevOps concepts to help you understand and implement an efficient CI/CD pipeline. It emphasizes the importance of understanding CI/CD workflows, tools, and success metrics before diving into hands-on activities.

## Key Concepts

### Compiled vs. Interpreted Programming Languages
- **Compiled Languages**: Require a build stage to create an executable (e.g., `.jar` for Java).
- **Interpreted Languages**: Run directly without being compiled (e.g., PHP, Python, JavaScript).
- Packaging code (e.g., `.tar.gz`, `.zip`) ensures efficient deployment and version tracking.

### Continuous Integration (CI)
- **Definition**: The practice of merging developers' code frequently into a shared repository to prevent integration issues ("Merge Hell").
- **Key Steps**:
  1. **Run Tests Locally**: Developers use Test-Driven Development (TDD) to run unit tests locally before committing.
  2. **Compile Code in CI**: A CI server like Jenkins compiles and builds code periodically or after each commit.
  3. **Run Further Tests in CI**: The CI server runs additional tests (e.g., static code analysis, integration tests).
  4. **Deploy an Artifact from CI**: Artifacts (compiled packages) are stored in an artifact repository for deployment.

### Continuous Delivery (CD) vs. Continuous Deployment
- **Continuous Delivery**: Ensures the application is always ready for deployment but requires manual approval.
- **Continuous Deployment**: Fully automates deployment after successful QA tasks.

## Real-World CI Pipeline

1. **Version Control**: Code commits are pushed to a central repository.
2. **Build**: Compiles or packages code with dependencies.
3. **Unit Test**: Runs developer-created tests to verify code quality.
4. **Deploy to Artifact Repository**: Stores various code versions for further use.
5. **Automated Testing**: Conducts integration, user acceptance (UAT), and penetration tests in respective environments.
6. **Deploy to Production**: Releases the application to users after approval or automation.
7. **Measure and Validate**: Collects live user feedback for improvements.

### Environments
- Dev, staging, pre-production, and production environments are defined in configuration (e.g., Ansible inventory files).

## Best Practices for CI/CD Pipelines

1. Maintain a code repository.
2. Automate the build process.
3. Ensure builds are self-tested.
4. Commit to the baseline daily.
5. Build every commit to the baseline.
6. Include test cases for bug-fix commits.
7. Keep builds fast.
8. Test in a clone of the production environment.
9. Simplify access to the latest deliverables.
10. Ensure visibility of build results.
11. Automate deployment for Continuous Deployment.

By adhering to these principles, you can build a robust and reliable CI/CD pipeline to streamline development, testing, and deployment processes.
![image](https://github.com/user-attachments/assets/b0c9491f-4736-44b7-aa75-74bdae641ac0)


# Why Are We Doing Everything We Are Doing? - **13 DevOps Success Metrics**

DevOps revolves around achieving **continuous delivery or deployment**, striving to ship high-quality code at a rapid pace. While ambitious, this goal must be achieved carefully to avoid breaking things in the process. By tracking specific metrics, teams can identify bottlenecks and maintain velocity without sacrificing quality or performance.

Here are the **13 key DevOps metrics** that can help you measure and optimize your processes:

---

## **1. Deployment Frequency**
- **What to track:** How often deployments occur in production and non-production environments.
- **Why it matters:** Smaller, frequent deployments reduce risk and make testing easier. Early and regular deployments to QA ensure adequate time for testing.

---

## **2. Lead Time**
- **What to track:** Time elapsed from starting work on an item to its deployment.
- **Why it matters:** Measures the speed at which teams deliver value, helping identify delays in the pipeline.

---

## **3. Customer Tickets**
- **What to track:** Number of support tickets related to bugs or performance issues.
- **Why it matters:** Indicates application quality and helps identify areas needing immediate improvement.

---

## **4. Percentage of Passed Automated Tests**
- **What to track:** Success rate of automated unit and functional tests.
- **Why it matters:** Highlights code stability and ensures automation reliability, a cornerstone of DevOps practices.

---

## **5. Defect Escape Rate**
- **What to track:** Number of defects found in production versus QA environments.
- **Why it matters:** Identifies gaps in testing processes and builds confidence in pre-production testing.

---

## **6. Availability**
- **What to track:** Application uptime, including planned maintenance and unplanned outages.
- **Why it matters:** Helps teams maintain reliability and set accurate expectations with users.

---

## **7. Service Level Agreements (SLAs)**
- **What to track:** Compliance with promised service levels or internal performance expectations.
- **Why it matters:** Ensures teams meet commitments and benchmarks for customer satisfaction.

---

## **8. Failed Deployments**
- **What to track:** Frequency of deployments causing outages or major issues.
- **Why it matters:** Highlights deployment risks and helps improve rollback strategies. May also be referred to as **Mean Time to Failure (MTTF).**

---

## **9. Error Rates**
- **What to track:** Frequency and types of application errors (e.g., exceptions, database issues).
- **Why it matters:** Serves as an indicator of application quality and ongoing performance issues.

### Common error types:
- **New bugs**: Errors introduced by recent code changes.
- **Production issues**: Errors related to database connections, query timeouts, etc.

---

## **10. Application Usage & Traffic**
- **What to track:** User transactions and traffic patterns post-deployment.
- **Why it matters:** Abnormal spikes or drops in traffic can indicate potential issues, such as routing errors or a DDOS attack.

---

## **11. Application Performance**
- **What to track:** Performance metrics like latency, database query efficiency, and resource usage.
- **Why it matters:** Monitoring tools (e.g., **DataDog**, **New Relic**) help teams identify and resolve performance bottlenecks during and after deployments.

---

## **12. Mean Time to Detection (MTTD)**
- **What to track:** Time taken to detect problems.
- **Why it matters:** Reducing detection time minimizes the impact of system outages or performance issues.

---

## **13. Mean Time to Recovery (MTTR)**
- **What to track:** Time taken to recover from system failures.
- **Why it matters:** Faster recovery times reduce business impact and demonstrate operational resilience.

---

## **Why These Metrics Matter**
These metrics collectively measure the effectiveness of DevOps processes in delivering value to users. They help teams focus on:
- **Velocity:** Accelerating development and delivery.
- **Quality:** Ensuring application stability and reliability.
- **Performance:** Maintaining high standards of usability and uptime.

By monitoring and optimizing these metrics, teams can ensure a robust CI/CD pipeline and meet the overarching goals of DevOps.
# Simulating a CI/CD Pipeline for a PHP-Based Application

This project simulates a typical **CI/CD pipeline** for PHP applications, continuing from the Ansible setup in Project 11. It includes multiple environments, demonstrating how to implement **continuous integration and delivery**.

## Key Details
- **PHP Applications:** Interpreted language that doesn’t require compilation but makes packaging and versioning releases challenging.
- **Release Strategy:** Instead of pulling directly from Git, the project uses the **Ansible `uri` module** for deployments.

---

## **Setup Overview**
- The project requires multiple servers to simulate different environments: 
  - **CI**
  - **Dev**
  - **Pentest**
  - Optional: **SIT (System Integration Testing)** and **UAT (User Acceptance Testing)**.
  
- Each environment has specific roles:
  - **Pentest:** For penetration, security, performance, and load testing.
  - **SIT/UAT:** Minimal setup as basic web servers hosting applications.

---

### **Important Notes**
1. **Server Creation:** 
   - Only create servers for the environment you’re currently working on.
   - Example: Focus on Development first, then move to CI, Pentest, etc.
2. **Cost Management:** 
   - Use AWS Free Tier or Google Cloud (GCP) $300 credit for virtual machines. 
   - Avoid advanced cloud configurations; only SSH access to VMs is required.
3. **Environment Progression:** 
   - Start small and spin up servers progressively as needed.

---

## **Initial Environments**
1. **CI (Continuous Integration)**: Testing code changes and automating builds.
2. **Dev (Development)**: Active development and testing.
3. **Pentest (Penetration Testing)**: 
   - Specialized tools and configurations for security and load testing.

---

## **Goals**
- Use **Nginx** as a reverse proxy for serving sites and tools.
- Simulate end-to-end CI/CD workflows for better infrastructure management and delivery processes.
![image](https://github.com/user-attachments/assets/22e7cda9-909e-4ced-9c96-1da402d22f84)
![Screenshot 2024-11-24 043655](https://github.com/user-attachments/assets/53fe7c6d-ab88-46f2-b705-07e0759499d3)

 Install Jenkins
Let's lunch a AWS ec2 with an Ubuntu OS instance and configure the jenkins server on it.

Install jenkins and it's dependencies using the terminal.
sudo apt-get update  # Update the instance
![Screenshot 2024-10-24 144520](https://github.com/user-attachments/assets/2a97c646-bf19-45ef-b546-9dc5fa7c9710)

# Download jenkins key
sudo wget -q -O - https://pkg.jenkins.io/debian/jenkins.io.key | sudo apt-key add -

# Add jenkins repository
sudo sh -c 'echo deb http://pkg.jenkins.io/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list'

# Add jenkins key
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 5BA31D57EF5975CA

# Install Java
sudo add-apt-repository ppa:openjdk-r/ppa
sudo apt-get update
sudo apt install openjdk-11-jdk

# Install Jenkins
sudo apt-get update
sudo apt-get install jenkins -y

# Enable and start Jenkins
sudo systemctl enable jenkins
sudo systemctl start jenkins
sudo systemctl status jenkins


Open TCP port 8080


2. Installing Blue-Ocean Plugin
Install Blue Ocean plugin a Sophisticated visualizations of CD pipelines for fast and intuitive comprehension of software pipeline status.

Follow the navigation below :

Go to manage jenkins > manage plugins > available
Search for BLUE OCEAN PLUGIN and install


Configure blue ocean pipeline with git repo
Follow the steps below:

Click "Open blue oceans" plugin and create a new pipeline
![Screenshot 2024-10-24 150541](https://github.com/user-attachments/assets/ea5d6f5e-9b31-45e0-9fd3-f26496eaab13)
![Screenshot 2024-10-24 151758](https://github.com/user-attachments/assets/45554730-4021-48d0-bec0-0bd17022e08c)
![Screenshot 2024-10-24 151901](https://github.com/user-attachments/assets/a1dea5a5-ed4c-40e7-af4d-d27f298f861f)


Select github
Connect github with jenkins using your github personal access token


Select the repository
Create the pipeline Here is our newly created pipeline. It takes the name of your GitHub repository.

![Screenshot 2024-10-24 152111](https://github.com/user-attachments/assets/023c0e21-8edb-43b3-980f-d268053c07f6)
![Screenshot 2024-10-24 152137](https://github.com/user-attachments/assets/559baddf-5ccf-4096-8714-363b71fc604e)

At this point you may not have a Jenkinsfile in the Ansible repository, so Blue Ocean will attempt to give you some guidance to create one. But we do not need that. We will rather create one ourselves. So, click on Administration to exit the Blue Ocean console.

Let us create our Jenkinsfile
Inside the Ansible project, create a new directory deploy and start a new file Jenkinsfile inside the directory.

Add the code snippet below to start building the Jenkinsfile gradually. This pipeline currently has just one stage called Build and the only thing we are doing is using the shell script module to echo Building Stage

pipeline {
    agent any


  stages {
    stage('Build') {
      steps {
        script {
          sh 'echo "Building Stage"'
        }
      }
    }
    }
}
Now go back into the Ansible pipeline in Jenkins, and select configure, Scroll down to Build Configuration section and specify the location of the Jenkinsfile at deploy/Jenkinsfile
![Screenshot 2024-10-24 163433](https://github.com/user-attachments/assets/f3df50fc-e63a-4518-9296-0e6f04d70a77)

o make your new branch show up in Jenkins, we need to tell Jenkins to scan the repository.

Click on the "Administration" button
Navigate to the Ansible project and click on "Scan repository now"
Refresh the page and both branches will start building automatically. You can go into Blue Ocean and see both branches there too.
In Blue Ocean, you can now see how the Jenkinsfile has caused a new step in the pipeline launch build for the new branch.
featurebranch
additional Tasks to perform tp better understand the whole process.
Let's create a pull request to merge the latest code into the main branch, after merging the PR, go back into your terminal and switch into the main branch.Pull the latest change.

mainupdate

Create a new branch, add more stages into the Jenkins file to simulate below phases. (Just add an echo command like we have in build and test stages) i. Package ii. Deploy iii. Clean up
![Screenshot 2024-10-24 174731](https://github.com/user-attachments/assets/d7abad9b-9311-418d-9f5c-a930fe73fafa)

![Screenshot 2024-10-24 174842](https://github.com/user-attachments/assets/39b472f4-7526-4774-be17-29e4035cd98f)
![Screenshot 2024-10-24 174856](https://github.com/user-attachments/assets/8a8df62f-3f51-43ce-b9a3-665a71b23099)
![Screenshot 2024-10-24 174936](https://github.com/user-attachments/assets/10eb9d74-9c36-42a7-a3e4-d1cfe6fec461)
![Screenshot 2024-10-24 174800](https://github.com/user-attachments/assets/8449b7fb-6a63-4ce9-9a29-568b1919e770)
![Screenshot 2024-10-24 174825](https://github.com/user-attachments/assets/397e88f4-f6ff-46da-8925-e427107181cd)

pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                script {
                    sh 'echo "Building Stage"'
                }
            }
        }

        stage('Test') {
            steps {
                script {
                    sh 'echo "Testing Stage"'
                }
            }
        }

        stage('Package') {
            steps {
                script {
                    sh 'echo "Packaging Stage"'
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    sh 'echo "Deploying Stage"'
                }
            }
        }

        stage('Clean up') {
            steps {
                script {
                    sh 'echo "Cleaning Up Stage"'
                }
            }
        }
    }
}


![Screenshot 2024-10-24 182606](https://github.com/user-attachments/assets/e02466ec-1ed5-4e9d-aa44-7e2afc441901)
![Screenshot 2024-10-24 182715](https://github.com/user-attachments/assets/c982a05e-3270-45f2-9f62-7b03cb5c5807)
![Screenshot 2024-10-24 182730](https://github.com/user-attachments/assets/34e1c7ea-5094-4e40-b10d-23be8a54ca39)
![Screenshot 2024-10-25 040829](https://github.com/user-attachments/assets/4b1da115-2c1e-49da-af84-0a9727c45055)
![Screenshot 2024-10-25 040837](https://github.com/user-attachments/assets/d102cacd-d57e-4119-a8d0-71c0ae89063f)

STEP FOUR : Running Ansible Playbook from Jenkins
Now that we have a broad overview of a typical Jenkins pipeline. Let us get the actual Ansible deployment to work by:

1. Installing Ansible on Jenkins
  sudo apt update && sudo apt upgrade -y
  sudo apt install ansible -y
2. Installing Ansible plugin in Jenkins UI
On the dashboard page, click on Manage Jenkins > Manage plugins > Under Available type in ansible and install without restart
![Screenshot 2024-10-24 182606](https://github.com/user-attachments/assets/737a1fc0-90f2-4a2c-8893-90288a078351)

![Screenshot 2024-10-24 182715](https://github.com/user-attachments/assets/c730ab79-a49a-4591-b234-b9a289f6ce17)
![Screenshot 2024-10-24 182730](https://github.com/user-attachments/assets/54dc6405-ecf7-4313-8ab9-3a2bd6f8322d)
Creating Jenkinsfile from scratch. (Delete all you currently have in there and start all over to get Ansible to run successfully)
Click on Dashboard > Manage Jenkins > Tools > Add Ansible. Add a name and the path ansible is installed on the jenkins server.

To get the ansible path on the jnekins server, run :

![Screenshot 2024-10-25 050348](https://github.com/user-attachments/assets/b1b83876-265c-45f5-8a8b-373c38e2bd8f)
![Screenshot 2024-10-25 044926](https://github.com/user-attachments/assets/c072cccb-0673-4cd6-87d0-91e6d80dfbb2)
![Screenshot 2024-10-25 045121](https://github.com/user-attachments/assets/2ff17053-e1a6-4f4b-9f68-a385a7f9d95c)
![Screenshot 2024-10-25 050314](https://github.com/user-attachments/assets/0908fd7c-d7fe-452f-9999-5e38e49e62b9)
![Screenshot 2024-10-25 050338](https://github.com/user-attachments/assets/d83b3abd-c485-489b-9ff8-c340d89fdb54)

Now, let's delete all we have in our Jenkinsfile and start writing it again. to do this, we can make use of pipeline syntax to ensure we get the exact command for what we intend to achieve. here is how the Jenkinsfile should look eventually .

        pipeline {
               agent any
             
               environment {
                 ANSIBLE_CONFIG = "${WORKSPACE}/deploy/ansible.cfg"
                 ANSIBLE_HOST_KEY_CHECKING = 'False'
               }
             
               stages {
                 stage("Initial cleanup") {
                   steps {
                     dir("${WORKSPACE}") {
                       deleteDir()
                     }
                   }
                 }

                 stage('Checkout SCM') {
                   steps {
                     git branch: 'main', url: 'https://github.com/citadelict/ansibllle-config-mgt.git'
                   }
                 }
             
                 stage('Prepare Ansible For Execution') {
                   steps {
                     sh 'echo ${WORKSPACE}'
                     sh 'sed -i "3 a roles_path=${WORKSPACE}/roles" ${WORKSPACE}/deploy/ansible.cfg'
                   }
                 }
             
                 stage('Test SSH Connections') {
                   steps {
                     script {
                       def hosts = [
                         [group: 'tooling', ip: '172.31.30.46', user: 'ec2-user'],
                         [group: 'tooling', ip: '172.31.25.209', user: 'ec2-user'],
                         [group: 'nginx', ip: '172.31.26.108', user: 'ubuntu'],
                         [group: 'db', ip: '172.31.24.250', user: 'ubuntu']
                       ]
                       for (host in hosts) {
                         sshagent(['private-key']) {
                           sh "ssh -o StrictHostKeyChecking=no -i /home/ubuntu/.ssh/key.pem ${host.user}@${host.ip} exit"
                         }
                       }
                     }
                   }
                 }
             
                 stage('Run Ansible playbook') {
                   steps {
                     sshagent(['private-key']) {
                       ansiblePlaybook(
                         become: true,
                         credentialsId: 'private-key',
                         disableHostKeyChecking: true,
                         installation: 'ansible',
                         inventory: "${WORKSPACE}/inventory/dev.yml",
                         playbook: "${WORKSPACE}/playbooks/site.yml"
                       )
                     }
                   }
                 }
             
                 stage('Clean Workspace after build') {
                   steps {
                     cleanWs(cleanWhenAborted: true, cleanWhenFailure: true, cleanWhenNotBuilt: true, cleanWhenUnstable: true, deleteDirs: true)
                   }
                 }
               }
             }

Here is what each part of my jenkinsfile does :
Environment variables are set for the pipeline: ANSIBLE_CONFIG specifies the path to the Ansible configuration file. while - - - ----------------- ANSIBLE_HOST_KEY_CHECKING disables host key checking to avoid interruptions during SSH connections.
Stage: Initial cleanup : This cleans up the workspace to ensure a fresh environment for the build by deleting all files in the workspace directory.
Stage: Checkout SCM : This checks out the source code from the specified Git repository, and alos uses git step to clone the repository.
Stage: Prepare Ansible For Execution : Prepares the Ansible environment by configuring the Ansible roles path by printing the workspace path, and modifying the Ansible configuration file to add the roles path.
Stage: Test SSH Connections : Verifies SSH connectivity to each server.
Stage: Run Ansible playbook : Executes the Ansible playbook. : - Uses the sshagent step to ensure the SSH key is available for Ansible. - Runs the ansiblePlaybook step with the specified parameters . #### To ensure jenkins properly connects to all servers, you will need to install another plugin known as ssh agent , after that, go to manage jenkins > credentials > global > add credentials , usee ssh username and password , fill out the neccesary details and save.
Now back to your inventory/dev.yml , update the inventory with thier respective servers private ip address
![Screenshot 2024-10-25 041759](https://github.com/user-attachments/assets/dda1340f-38a2-4f96-8e3a-23f47918565f)
Update the ansible playbook in playbooks/site.yml for the tooling web app deployment. Click on Build Now.
![Screenshot 2024-11-04 091342](https://github.com/user-attachments/assets/5cb0b4cf-109e-4510-a93e-cfbc6492d1ec)
![Screenshot 2024-11-04 084923](https://github.com/user-attachments/assets/284c85a0-1203-427a-9e41-fde7c1d6d191)
![Screenshot 2024-11-04 094459](https://github.com/user-attachments/assets/e2cc9090-e5e2-48d4-a6c2-250ebed8d546)
![Screenshot 2024-11-04 094639](https://github.com/user-attachments/assets/319d2a37-45af-405e-b716-858c5d8f724c)

Parameterizing Jenkinsfile For Ansible Deployment
let's Update our `/inventory/sit.yml file with the code below

          [tooling]
        <SIT-Tooling-Web-Server-Private-IP-Address>
        
        [todo]
        <SIT-Todo-Web-Server-Private-IP-Address>
        
        [nginx]
        <SIT-Nginx-Private-IP-Address>
        
        [db:vars]
        ansible_user=ec2-user
        ansible_python_interpreter=/usr/bin/python
        
        [db]
        <SIT-DB-Server-Private-IP-Address>

![Screenshot 2024-11-04 084923](https://github.com/user-attachments/assets/4713985e-451f-4f25-ae88-b6fcd0bb5b3f)

There are always several environments that need configuration, such as CI, site, and pentest environments etc. To manage and run these environments dynamically, we need to update the Jenkinsfile.

           parameters {
    string(name: 'inventory', defaultValue: 'dev',  description: 'This is the inventory file for the environment to deploy configuration')
  }
In the Ansible execution section, remove the hardcoded inventory/dev and replace with `${inventory}

From now on, each time we hit on execute, it will expect an input.

![image](https://github.com/user-attachments/assets/29c3d774-7c59-4a0d-80dc-61548a7cfb33)

Notice that the default value loads up, but we can now specify which environment we want to deploy the configuration to. Simply type sit and hit Run build parameter

update the jenkins file to included the ansible tags before it runs playbook

![image](https://github.com/user-attachments/assets/a4aafa95-7087-479a-b6ee-5afe4876d89f)

Click on build with parameters and update the inventory field to sit and the the ansible_tags to webserver

  string(name: 'ansible_tags', defaultValue: 'webserver', description: 'Tags for the Ansible playbook')
update WEBSERVER


STEP FIVE: CI/CD Pipeline for TODO application
We already have tooling website as a part of deployment through Ansible. Here we will introduce another PHP application to add to the list of software products we are managing in our infrastructure. The good thing with this particular application is that it has unit tests, and it is an ideal application to show an end-to-end CI/CD pipeline for a particular application.

Our goal here is to deploy the application onto servers directly from Artifactory rather than from git. If you have not updated Ansible with an Artifactory role, simply use this guide to create an Ansible role for Artifactory (ignore the Nginx part).

Phase 1 - Prepare Jenkins
Let's Fork the repository below into your GitHub account

https://github.com/StegTechHub/php-todo.git
On you Jenkins server, install PHP, its dependencies and Composer tool (Feel free to do this manually at first, then update your Ansible accordingly later)

    sudo apt update
    sudo apt install -y zip libapache2-mod-php phploc php-{xml,bcmath,bz2,intl,gd,mbstring,mysql,zip}
    php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
    sudo php composer-setup.php --install-dir=/usr/local/bin --filename=composer
    php -r "unlink('composer-setup.php');"
    php -v
    composer -v

![Screenshot 2024-11-04 140337](https://github.com/user-attachments/assets/834d02d6-720d-470f-b6ff-96ff9c90d5b4)

![Screenshot 2024-11-12 170150](https://github.com/user-attachments/assets/9ec9beb2-6d32-4733-b315-f0c8713673e9)

Install the required jenkins plugin, which is plot and Artifactory plugins
Plot Plugin Installation : We will use plot plugin to display tests reports, and code coverage informati
![Screenshot 2024-11-04 140924](https://github.com/user-attachments/assets/42a0a949-5e43-4da4-92de-762856aec20a)
![Screenshot 2024-11-04 140855](https://github.com/user-attachments/assets/44336283-a3b9-4df8-906f-90fd36faf68c)
Artifactory Plugin Installation : The Artifactory plugin will be used to easily upload code artifacts into an Artifactory server.
![Screenshot 2024-11-04 143548](https://github.com/user-attachments/assets/57a9947e-925d-4665-9923-15b59e49882a)
![Screenshot 2024-11-04 143700](https://github.com/user-attachments/assets/d6cfa6d7-c091-4275-a30f-3f3c7d446066)
Phase 2 – Set up Ansible roles for artifactory
Create roles to install artifactory just the same way we set up apache, mysql and nginx in the previous project.
artifactory
and add the code below to static-assignments/artifactory.yml

---
- hosts: artifactory
  roles:
     - artifactory
  become: true
![Screenshot 2024-11-17 090843](https://github.com/user-attachments/assets/d9f6cea0-3500-442f-ace8-18b48e4a2c0f)
![Screenshot 2024-11-17 090858](https://github.com/user-attachments/assets/8abe6d68-a383-4536-8726-fe8dda6e69ca)

Configure Artifactory plugin by going to manage jenkins > system configurations, scroll down to jfrog and click on add instance

Input the ID, artifactory url , username and password

Click on test connection to test your url

Visit your <your-artifactory-ip-address:8081

Sign in using the default artifactory credentials : admin and password

![Screenshot 2024-11-17 093128](https://github.com/user-attachments/assets/795f9c18-f6bd-4afa-8bb9-00a0b5357c25)
Create a local repository and call it todo-dev-local, set the repository type to generic

![Screenshot 2024-11-19 090142](https://github.com/user-attachments/assets/d584b83d-2c9b-4761-b879-804eefdebec9)

Update the database configuration in roles/mysql/vars/main.yml to create a new database and user for the Todo App. use the details below :

          Create database homestead;
          CREATE USER 'homestead'@'%' IDENTIFIED BY 'sePret^i';
          GRANT ALL PRIVILEGES ON * . * TO 'homestead'@'%';
![Screenshot 2024-11-09 022957](https://github.com/user-attachments/assets/86ddb3cc-b4b3-4762-844f-5b565cc9b124)

Create a Multibranch pipeline for the Php Todo App.
o![Screenshot 2024-11-09 042215](https://github.com/user-attachments/assets/d2205605-84dd-49aa-822d-b6b5f0812a77)
Create a .env.sample file and update it with the credentials to connect the database, use sample the code below :
                DB_HOST=172.31.24.250
                DB_DATABASE=homestead
                DB_USERNAME=homestead
                DB_PASSWORD=sePret^i

![Screenshot 2024-11-09 022957](https://github.com/user-attachments/assets/ea98667f-66a5-488e-bede-05133716c17d)
![Screenshot 2024-11-09 035615](https://github.com/user-attachments/assets/3926ab38-83cb-4bbd-8d81-6815842d5520)
install mysql client on jenkins server
                    sudo yum install mysql -y 
Update Jenkinsfile with proper pipeline configuration pipeline { agent any
 stages {
                 
                      stage("Initial cleanup") {
                           steps {
                             dir("${WORKSPACE}") {
                               deleteDir()
                             }
                           }
                         }
                   
                     stage('Checkout SCM') {
                       steps {
                             git branch: 'main', url: 'https://github.com/William-eng/php-todo.git'
                       }
                     }
                 
                     stage('Prepare Dependencies') {
                       steps {
                              sh 'mv .env.sample .env'
                              sh 'composer install'
                              sh 'php artisan migrate'
                              sh 'php artisan db:seed'
                              sh 'php artisan key:generate'
                       }
                     }
                   }
                 }
Ensure that all neccesary php extensions are already installed .

Run the pipeline build , you will notice that the database has been populated with tables using a method in laravel known as migration and seeding.
![Screenshot 2024-![Screenshot 2024-11-18 075134](https://github.com/user-attachments/assets/275b305c-9a8c-480a-9af3-7e29d3e0da1f)
11-09 043514](https://github.com/user-attachments/assets/dcc1b6b7-4405-4eee-969d-c8f95f9bc785)
  #!/bin/bash

      # Variables for versions
      PHPUNIT_VERSION="9.5.10"
      PHPLOC_VERSION="6.0.0"
      
      # Download and install PHPUnit
      echo "Downloading PHPUnit..."
      wget -O phpunit.phar https://phar.phpunit.de/phpunit-${PHPUNIT_VERSION}.phar
      
      echo "Making PHPUnit executable..."
      chmod +x phpunit.phar
      
      echo "Moving PHPUnit to /usr/local/bin..."
      sudo mv phpunit.phar /usr/local/bin/phpunit
      
      echo "Checking PHPUnit version..."
      phpunit --version
      
      # Download and install PHPLoc
      echo "Downloading PHPLoc..."
      wget -O phploc.phar https://phar.phpunit.de/phploc-${PHPLOC_VERSION}.phar
      
      echo "Making PHPLoc executable..."
      chmod +x phploc.phar
      
      echo "Moving PHPLoc to /usr/local/bin..."
      sudo mv phploc.phar /usr/local/bin/phploc
      
      echo "Checking PHPLoc version..."
      phploc --version
      
      echo "Installation of PHPUnit and PHPLoc completed successfully!"
Update the Jenkinsfile to include Unit tests step

                   stage('Execute Unit Tests') {
                steps {
                       sh './vendor/bin/phpunit'
                }
Phase 3 – Code Quality Analysis
This is one of the areas where developers, architects and many stakeholders are mostly interested in as far as product development is concerned. For PHP the most commonly tool used for code quality analysis is phploc.

The data produced by phploc can be ploted onto graphs in Jenkins.

To implement this, add the flow code snippet. The output of the data will be saved in build/logs/phploc.csv file.

                  stage('Code Analysis') {
                    steps {
                          sh 'phploc app/ --log-csv build/logs/phploc.csv'
                  
                    }
                  }
This plugin provides generic plotting (or graphing) capabilities in Jenkins. It will plot one or more single values variations across builds in one or more plots. Plots for a particular job (or project) are configured in the job configuration screen, where each field has additional help information. Each plot can have one or more lines (called data series). After each build completes the plots’ data series latest values are pulled from the CSV file generated by phploc.

Plot the data using plot Jenkins plugin. This plugin provides generic plotting (or graphing) capabilities in Jenkins. It will plot one or more single values variations across builds in one or more plots. Plots for a particular job (or project) are configured in the job configuration screen, where each field has additional help information. Each plot can have one or more lines (called data series). After each build completes the plots' data series latest values are pulled from the CSV file generated by phploc.

  pipeline {
      agent any
  
      stages {
          stage('Code Analysis') {
              steps {
                  // Running PHPLoc for code analysis
                  sh 'phploc app/ --log-csv build/logs/phploc.csv'
              }
          }
  
  
          stage('Plot Code Coverage Report') {
              steps {
                  script {
                      // Plotting code metrics using the generated CSV from PHPLoc
                      plot csvFileName: 'plot-396c4a6b-b573-41e5-85d8-73613b2ffffb.csv', 
                           csvSeries: [[displayTableFlag: false, exclusionValues: 'Lines of Code (LOC),Comment Lines of Code (CLOC),Non-Comment Lines of Code (NCLOC),Logical Lines of Code (LLOC)', 
                                        file: 'build/logs/phploc.csv', inclusionFlag: 'INCLUDE_BY_STRING', url: '']], 
                           group: 'phploc', numBuilds: '100', style: 'line', title: 'A - Lines of code', yaxis: 'Lines of Code'
  
                      plot csvFileName: 'plot-396c4a6b-b573-41e5-85d8-73613b2ffffb.csv', 
                           csvSeries: [[displayTableFlag: false, exclusionValues: 'Directories,Files,Namespaces', 
                                        file: 'build/logs/phploc.csv', inclusionFlag: 'INCLUDE_BY_STRING', url: '']], 
                           group: 'phploc', numBuilds: '100', style: 'line', title: 'B - Structures Containers', yaxis: 'Count'
  
                      plot csvFileName: 'plot-396c4a6b-b573-41e5-85d8-73613b2ffffb.csv', 
                           csvSeries: [[displayTableFlag: false, exclusionValues: 'Average Class Length (LLOC),Average Method Length (LLOC),Average Function Length (LLOC)', 
                                        file: 'build/logs/phploc.csv', inclusionFlag: 'INCLUDE_BY_STRING', url: '']], 
                           group: 'phploc', numBuilds: '100', style: 'line', title: 'C - Average Length', yaxis: 'Average Lines of Code'
  
                      plot csvFileName: 'plot-396c4a6b-b573-41e5-85d8-73613b2ffffb.csv', 
                           csvSeries: [[displayTableFlag: false, exclusionValues: 'Cyclomatic Complexity / Lines of Code,Cyclomatic Complexity / Number of Methods ', 
                                        file: 'build/logs/phploc.csv', inclusionFlag: 'INCLUDE_BY_STRING', url: '']], 
                           group: 'phploc', numBuilds: '100', style: 'line', title: 'D - Relative Cyclomatic Complexity', yaxis: 'Cyclomatic Complexity by Structure'
  
                      plot csvFileName: 'plot-396c4a6b-b573-41e5-85d8-73613b2ffffb.csv', 
                           csvSeries: [[displayTableFlag: false, exclusionValues: 'Classes,Abstract Classes,Concrete Classes', 
                                        file: 'build/logs/phploc.csv', inclusionFlag: 'INCLUDE_BY_STRING', url: '']], 
                           group: 'phploc', numBuilds: '100', style: 'line', title: 'E - Types of Classes', yaxis: 'Count'
  
                      plot csvFileName: 'plot-396c4a6b-b573-41e5-85d8-73613b2ffffb.csv', 
                           csvSeries: [[displayTableFlag: false, exclusionValues: 'Methods,Non-Static Methods,Static Methods,Public Methods,Non-Public Methods', 
                                        file: 'build/logs/phploc.csv', inclusionFlag: 'INCLUDE_BY_STRING', url: '']], 
                           group: 'phploc', numBuilds: '100', style: 'line', title: 'F - Types of Methods', yaxis: 'Count'
  
                      plot csvFileName: 'plot-396c4a6b-b573-41e5-85d8-73613b2ffffb.csv', 
                           csvSeries: [[displayTableFlag: false, exclusionValues: 'Constants,Global Constants,Class Constants', 
                                        file: 'build/logs/phploc.csv', inclusionFlag: 'INCLUDE_BY_STRING', url: '']], 
                           group: 'phploc', numBuilds: '100', style: 'line', title: 'G - Types of Constants', yaxis: 'Count'
  
                      plot csvFileName: 'plot-396c4a6b-b573-41e5-85d8-73613b2ffffb.csv', 
                           csvSeries: [[displayTableFlag: false, exclusionValues: 'Test Classes,Test Methods', 
                                        file: 'build/logs/phploc.csv', inclusionFlag: 'INCLUDE_BY_STRING', url: '']], 
                           group: 'phploc', numBuilds: '100', style: 'line', title: 'I - Testing', yaxis: 'Count'
  
                      plot csvFileName: 'plot-396c4a6b-b573-41e5-85d8-73613b2ffffb.csv', 
                           csvSeries: [[displayTableFlag: false, exclusionValues: 'Logical Lines of Code (LLOC),Classes Length (LLOC),Functions Length (LLOC),LLOC outside functions or classes ', 
                                        file: 'build/logs/phploc.csv', inclusionFlag: 'INCLUDE_BY_STRING', url: '']], 
                           group: 'phploc', numBuilds: '100', style: 'line', title: 'AB - Code Structure by Logical Lines of Code', yaxis: 'Logical Lines of Code'
  
                      plot csvFileName: 'plot-396c4a6b-b573-41e5-85d8-73613b2ffffb.csv', 
                           csvSeries: [[displayTableFlag: false, exclusionValues: 'Functions,Named Functions,Anonymous Functions', 
                                        file: 'build/logs/phploc.csv', inclusionFlag: 'INCLUDE_BY_STRING', url: '']], 
                           group: 'phploc', numBuilds: '100', style: 'line', title: 'H - Types of Functions', yaxis: 'Count'
  
                      plot csvFileName: 'plot-396c4a6b-b573-41e5-85d8-73613b2ffffb.csv', 
                           csvSeries: [[displayTableFlag: false, exclusionValues: 'Interfaces,Traits,Classes,Methods,Functions,Constants', 
                                        file: 'build/logs/phploc.csv', inclusionFlag: 'INCLUDE_BY_STRING', url: '']], 
                           group: 'phploc', numBuilds: '100', style: 'line', title: 'BB - Structure Objects', yaxis: 'Count'
                  }
              }
          }
      }
  
     
      }
  }
![Screenshot 2024-11-19 054319](https://github.com/user-attachments/assets/7e8dd265-a499-4671-a054-aa96397fa1a2)
![Screenshot 2024-11-19 080828](https://github.com/user-attachments/assets/63e4d42c-19e0-4db5-b1b2-75b07f115893)
![Screenshot 2024-11-19 080841](https://github.com/user-attachments/assets/b9d9affc-d015-4d52-aefa-6161859729ed)

Phase 4 – Bundle and deploy :
Bundle the todo application code into an artifact and upload to jfrog artifactory. to do this, we have to add a stage to our todo jenkinsfile to save ethe artifact as a zip file, to do this : * Edit your php-todo/Jenkinsfile , add the code below

                                   stage('Package Artifact') {
                                 steps {
                                     sh 'zip -qr php-todo.zip ${WORKSPACE}/*'
                                 }
                             }
Add another stage to upload the zipped artifact into our already configured artifactory repository.

                       stage('Upload Artifact to Artifactory') {
                        steps {
                            script {
                                def server = Artifactory.server 'artifactory-server'
                                def uploadSpec = """{
                                    "files": [
                                    {
                                        "pattern": "php-todo.zip",
                                        "target": "Todo-dev/php-todo.zip",
                                        "props": "type=zip;status=ready"
                                    }
                                    ]
                                }"""
                                println "Upload Spec: ${uploadSpec}"
                                try {
                                    server.upload spec: uploadSpec
                                    println "Upload successful"
                                } catch (Exception e) {
                                    println "Upload failed: ${e.message}"
                                }
                            }
                        }
                    }
Deploy the application to the dev envionment : todo server by launching the ansible playbook.

                       stage('Deploy to Dev Environment') {
                       steps {
                           build job: 'ansibllle-config-mgt/main', parameters: [[$class: 'StringParameterValue', name: 'inventory', value: 'dev']], propagate: false, wait: true
                       }
                   }
               }

![Screenshot 2024-11-19 085940](https://github.com/user-attachments/assets/2319622b-35fc-4cc9-a35a-46439de337e6)

![Screenshot 2024-11-19 090020](https://github.com/user-attachments/assets/b3b634be-90a4-40d2-acd9-429e3be4951f)
![Screenshot 2024-11-19 083958](https://github.com/user-attachments/assets/398713bc-f7cb-4666-a195-2c5f236098ac)
![Screenshot 2024-11-19 084013](https://github.com/user-attachments/assets/63ff4e12-2120-42c4-b381-437f1c8358b1)
![Screenshot 2024-11-19 085836](https://github.com/user-attachments/assets/4f04c4b1-f177-42c6-9ace-8bac79827d9a)
![Screenshot 2024-11-19 085940](https://github.com/user-attachments/assets/61ba47b4-dff0-4d2f-ad30-a5f987b712a5)
![Screenshot 2024-11-19 090142](https://github.com/user-attachments/assets/c51a2f65-e4b4-4749-91ea-d73c529675ef)

The build job used in this step tells Jenkins to start another job. In this case it is the ansible-project job, and we are targeting the main branch. Hence, we have ansible-project/main. Since the Ansible project requires parameters to be passed in, we have included this by specifying the parameters section. The name of the parameter is env and its value is dev. Meaning, deploy to the Development environment.

But how are we certain that the code being deployed has the quality that meets corporate and customer requirements? Even though we have implemented Unit Tests and Code Coverage Analysis with phpunit and phploc, we still need to implement Quality Gate to ensure that ONLY code with the required code coverage, and other quality standards make it through to the environments.

To achieve this, we need to configure SonarQube - An open-source platform developed by SonarSource for continuous inspection of code quality to perform automatic reviews with static analysis of code to detect bugs, code smells, and security vulnerabilities.

SonarQube Installation
SonarQube is a tool that can be used to create quality gates for software projects, and the ultimate goal is to be able to ship only quality software code.

Install SonarQube on Ubuntu 20.04 With PostgreSQL as Backend Database
SonarQube is a tool that can be used to create quality gates for software projects, and the ultimate goal is to be able to ship only quality software code.

steps to Install SonarQube on Ubuntu 24.04 With PostgreSQL as Backend Database
First thing we need to do is to tune linux to ensure optimum performance

   sudo sysctl -w vm.max_map_count=262144
   sudo sysctl -w fs.file-max=65536
   ulimit -n 65536
   ulimit -u 4096
Ensure a permanent change by editing the /etc/security/limits.conf , add the code below into it

      sonarqube   -   nofile   65536
    sonarqube   -   nproc    4096
Update and upgrade system packages

      sudo apt-get update
    sudo apt-get upgrade
Install wget and unzip packages

      sudo apt-get install wget unzip -y
Install OpenJDK and Java Runtime Environment (JRE) 11

      sudo apt-get install openjdk-11-jdk -y
     sudo apt-get install openjdk-11-jre -y
Set default JDK - To set default JDK or switch to OpenJDK, to achieve this , use the command below :

       sudo update-alternatives --config java
select your java from the list, that is if you already have mutiple installations of diffrent jdk versions

Verify the set JAVA Version:

      java -version
Install and Setup PostgreSQL 10 Database for SonarQube
PostgreSQL repo to the repo list:

sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt/ `lsb_release -cs`-pgdg main" >> /etc/apt/sources.list.d/pgdg.list'
Download PostgreSQL software

wget -q https://www.postgresql.org/media/keys/ACCC4CF8.asc -O - | sudo apt-key add -
Install, start and ensure PostgreSQL Database Server enables automatically during booting

   sudo apt-get -y install postgresql postgresql-contrib
   sudo systemctl start postgresql
   sudo systemctl enable postgresql
Change the password for the default postgres user

sudo passwd postgres
Set up User and password for postgres

Switch to the postgres user

 su - postgres
