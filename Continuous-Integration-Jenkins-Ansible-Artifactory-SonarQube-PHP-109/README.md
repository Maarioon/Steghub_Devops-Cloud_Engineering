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

