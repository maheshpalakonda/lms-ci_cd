pipeline {
    agent any

    tools {
        jdk 'java21'
        nodejs 'NodeJS'
    }

    environment {
        COMPOSE_FILE    = 'docker-compose.yml'
        BACKEND_IMAGE   = 'mahesh1925/lms-backend'
        FRONTEND_IMAGE  = 'mahesh1925/lms-frontend'
    }

    stages {

        /* 1️⃣ Checkout Code */
        stage('Checkout Code') {
            steps {
                git branch: 'master',
                    url: 'https://github.com/maheshpalakonda/lms-ci_cd.git',
                    credentialsId: 'github-pat'
            }
        }

        /* 2️⃣ Build Docker Images */
        stage('Build Docker Images') {
            steps {
                sh '''
                    echo "🏗️ Building Docker images..."
                    docker build -t ${BACKEND_IMAGE}:latest -f backend/Dockerfile.backend backend
                    docker build -t ${FRONTEND_IMAGE}:latest -f frontend/Dockerfile.frontend frontend
                '''
            }
        }

        /* 3️⃣ Push Images to Docker Hub */
        stage('Push to Docker Hub') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-creds',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )
                ]) {
                    sh '''
                        echo "🔑 Logging into Docker Hub..."
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin

                        docker push ${BACKEND_IMAGE}:latest
                        docker push ${FRONTEND_IMAGE}:latest

                        docker logout
                    '''
                }
            }
        }

        /* 4️⃣ Deploy Containers – OPTION 3 */
        stage('Deploy Containers') {
            steps {
                withCredentials([
                    file(credentialsId: 'backend-env', variable: 'BACKEND_ENV'),
                    file(credentialsId: 'frontend-env', variable: 'FRONTEND_ENV')
                ]) {
                    sh '''
                        echo "🧩 Deploying containers (Option 3)..."

                        export BACKEND_ENV=$BACKEND_ENV
                        export FRONTEND_ENV=$FRONTEND_ENV

                        docker compose -f ${COMPOSE_FILE} down || true
                        docker compose -f ${COMPOSE_FILE} up -d --force-recreate --remove-orphans

                        echo "✅ Deployment completed successfully!"
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "✅ Build & Deployment succeeded!"
        }
        failure {
            echo "❌ Build Failed — Check Jenkins Logs."
        }
    }
}

