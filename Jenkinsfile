#!/usr/bin/env groovy

pipeline {
    agent any
    stages {
        stage('docker push images to registries') {
            steps {
                sh 'docker-compose -f docker-compose.yml build'
                sh 'docker-compose push'
            }
        }
        stage('docker stack deploy') {
            steps {
                sh 'env profile=ci docker stack deploy --compose-file docker-swarm.yml event-manager'
            }
        }
    }
}
