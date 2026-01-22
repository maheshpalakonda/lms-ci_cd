pipeline {
    agent any

    tools {
        jdk 'java21'
        nodejs 'NodeJS'
    }

    environment {
        COMPOSE_FILE     = 'docker-compose.yml'
        DOCKER_HUB_USER  = 'mahesh1925'
        BACKEND_IMAGE    = 'mahesh1925/lms-backend'
        FRONTEND_IMAGE   = 'mahesh1925/lms-frontend'
    }

    stages {

        /* Checkout code */
        stage('Checkout Code') {
            steps {
                git branch: 'master',
                    url: 'https://github.com/maheshpalakonda/lms-ci_cd.git',
                    credentialsId: 'github-pat'
            }
        }

        /* Build Docker images */
        stage('Build Docker Images') {
            steps {
                sh '''
                    echo "🏗️ Building Docker images..."
                    docker build -t ${BACKEND_IMAGE}:latest -f backend/Dockerfile.backend backend
                    docker build -t ${FRONTEND_IMAGE}:latest -f frontend/Dockerfile.frontend frontend
                '''
            }
        }

        /* Push images to Docker Hub */
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

        /* OLD Deploy Stage (uses sudo + .env files) */
        stage('Deploy Containers') {
            steps {
                withCredentials([
                    file(credentialsId: 'backend-env', variable: 'BACKEND_ENV'),
                    file(credentialsId: 'frontend-env', variable: 'FRONTEND_ENV')
                ]) {
                    sh '''
                        echo "🧩 Deploying containers (OLD WAY)..."

                        mkdir -p /app/lms || sudo mkdir -p /app/lms

                        cp $BACKEND_ENV backend/.env || sudo cp $BACKEND_ENV backend/.env
                        cp $FRONTEND_ENV frontend/.env || sudo cp $FRONTEND_ENV frontend/.env

                        docker rm -f lms-backend lms-frontend || true

                        docker compose -f ${COMPOSE_FILE} down || true
                        docker compose -f ${COMPOSE_FILE} up -d --force-recreate

                        echo "✅ Deployment completed"
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
            echo "❌ Build Failed"
        }
    }
}

