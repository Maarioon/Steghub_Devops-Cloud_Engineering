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

