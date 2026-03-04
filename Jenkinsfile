// ============================================================
// TASKMANAGER — FULL STACK GITOPS PIPELINE (PRODUCTION READY)
// Jenkins builds → pushes image → updates GitOps repo
// Argo CD handles deployment
// ============================================================

pipeline {
    agent any

    tools {
    nodejs 'Node 18'   // name from Jenkins global tool config
    }

    parameters {
        booleanParam(name: 'BUILD_FRONTEND', defaultValue: true, description: 'Build & push frontend')
        booleanParam(name: 'BUILD_BACKEND',  defaultValue: true, description: 'Build & push backend')
    }

    environment {
        FE_IMAGE      = 'vuthytourn/taskmanager-frontend'
        BE_IMAGE      = 'vuthytourn/taskmanager-backend'
        REGISTRY_CRED = 'dockerhub-credentials'
        GITOPS_REPO   = 'https://github.com/Vuthy-Tourn/taskmanager-helm.git'
        GITOPS_BRANCH = 'main'
        GITOPS_CRED   = 'gitops-credentials'
    }

    options {
        timeout(time: 60, unit: 'MINUTES')
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {

        stage('Checkout App Repo') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Vuthy-Tourn/simple-task-manager'
            }
        }

        stage('Set Image Tag') {
        steps {
            script {
                env.GIT_COMMIT = sh(script: 'git rev-parse HEAD', returnStdout: true).trim()
                env.IMAGE_TAG = "sha-${env.GIT_COMMIT.take(7)}"
            }
            echo "Using IMAGE_TAG=${env.IMAGE_TAG}"
            }
        }

        // ========================
        // FRONTEND
        // ========================

        stage('Frontend: Install') {
            when { expression { params.BUILD_FRONTEND } }
            steps { dir('frontend') { sh 'npm ci' } }
        }

        stage('Frontend: Lint & TypeCheck') {
            when { expression { params.BUILD_FRONTEND } }
            parallel {
                stage('TypeScript') { steps { dir('frontend') { sh 'npx tsc --noEmit' } } }
                stage('ESLint')     { steps { dir('frontend') { sh 'npm run lint' } } }
            }
        }

        stage('Frontend: Build & Push Image') {
            when { expression { params.BUILD_FRONTEND } }
            steps {
                withCredentials([usernamePassword(
                    credentialsId: env.REGISTRY_CRED,
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    dir('frontend') {
                        sh '''
                            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                            docker build -t $FE_IMAGE:$IMAGE_TAG -t $FE_IMAGE:latest .
                            docker push $FE_IMAGE:$IMAGE_TAG
                            docker push $FE_IMAGE:latest
                        '''
                    }
                }
            }
        }
        // ========================
        // BACKEND (Spring Boot + Gradle)
        // ========================

        stage('Backend: Test') {
            when { expression { params.BUILD_BACKEND } }
            steps {
                dir('backend') {
                    sh """
                        chmod +x gradlew
                        ./gradlew test
                    """
                }
            }
            post {
                always {
                    junit allowEmptyResults: true,
                          testResults: 'backend/build/test-results/test/*.xml'
                }
            }
        }

        stage('Backend: Build & Push Image') {
            when { expression { params.BUILD_BACKEND } }
            steps {
                withCredentials([usernamePassword(
                    credentialsId: env.REGISTRY_CRED,
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    dir('backend') {
                        sh """
                            chmod +x gradlew
                            ./gradlew clean bootJar -x test

                            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin https://index.docker.io/v1/
                            docker build -t $BE_IMAGE:$IMAGE_TAG -t $BE_IMAGE:latest .
                            docker push $BE_IMAGE:$IMAGE_TAG
                            docker push $BE_IMAGE:latest
                        """
                    }
                }
            }
        }

        // ========================
        // UPDATE GITOPS REPO
        // ========================

        stage('Update GitOps Repo') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: env.GITOPS_CRED,
                    usernameVariable: 'GIT_USER',
                    passwordVariable: 'GIT_PASS'
                )]) {
                    // Clone the repo into workspace folder
                    sh '''
                        rm -rf taskmanager-helm
                        git clone https://$GIT_USER:$GIT_PASS@github.com/Vuthy-Tourn/taskmanager-helm.git taskmanager-helm
                    '''

                    // Work inside the repo
                    dir('taskmanager-helm') {
                        sh """
                            git checkout $GITOPS_BRANCH
                            git pull origin $GITOPS_BRANCH

                            # Ensure the file exists
                            if [ ! -f ./umbrella-chart/values-prod.yaml ]; then
                                echo "Error: values-prod.yaml not found!"
                                exit 1
                            fi

                            # Update frontend image tag
                            if [ "$BUILD_FRONTEND" = "true" ]; then
                                yq e -i '.frontend.image.tag = "'$IMAGE_TAG'"' ./umbrella-chart/values-prod.yaml
                            fi

                            # Update backend image tag
                            if [ "$BUILD_BACKEND" = "true" ]; then
                                yq e -i '.backend.image.tag = "'$IMAGE_TAG'"' ./umbrella-chart/values-prod.yaml
                            fi

                            # Git config
                            git config user.email "jenkins@ci.local"
                            git config user.name "jenkins"

                            # Stage the file using correct path
                            git add ./umbrella-chart/values-prod.yaml

                            # Commit if changes exist
                            git commit -m "ci: update image tag to $IMAGE_TAG [skip ci]" || echo "No changes to commit"

                            # Push changes
                            git push origin $GITOPS_BRANCH
                        """
                    }
                }
            }
        }
    }

    post {
        success {
            echo "Frontend image: $FE_IMAGE:$IMAGE_TAG"
            echo "Backend image:  $BE_IMAGE:$IMAGE_TAG"
            echo "GitOps repo updated successfully."
            echo "Argo CD will auto-sync and deploy."
        }
        always {
            cleanWs()
        }
    }
}