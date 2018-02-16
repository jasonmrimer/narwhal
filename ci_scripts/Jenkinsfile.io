node ('') {
    stage ('Checkout') {
        git url: 'git@gitlab.devops.geointservices.io:rimerjm/narwhal.git', branch: 'master', credentialsId: '358d626c-22cc-4bd9-a0e3-74d99d4dabab', poll: true
    }

    stage ('Test and Build') {
        sh """
        if [[ \"\$(docker images -q narwhalpivotal/base-image 2> /dev/null)\" == \"\" ]]; then
            docker pull narwhalpivotal/base-image
        fi
        
        docker stop narwhal || true && docker rm narwhal || true
        
        docker run --name narwhal -v `pwd`:/app -itd  narwhalpivotal/base-image
        
        docker exec narwhal /bin/bash -c "cd /app && ./all-tests.sh"
        """
    }

    stage ('SonarQube') {
        def sonarXmx = '512m'
        def sonarHost = 'https://sonar.geointservices.io'
        def scannerHome = tool 'SonarQube Runner 2.8';
        withSonarQubeEnv('DevOps Sonar') {
          withCredentials([[$class: 'StringBinding', credentialsId: 'sonarqube', variable: 'SONAR_LOGIN']]) {
            sh "set && ${scannerHome}/bin/sonar-scanner -Dsonar.host.url=${sonarHost} -Dsonar.login=${SONAR_LOGIN}"
            sh "set && cd server && ./gradlew sonarqube -Dsonar.host.url=${sonarHost} -Dsonar.login=${SONAR_LOGIN} -Dsonar.projectKey=narwhal -Dsonar.projectName=narwhal -x test"
          }
        }
      }
    
    stage ('FortifyScan') {
        sh '/opt/hp_fortify_sca/bin/sourceanalyzer -64 -verbose -Xms2G -Xmx10G -b ${BUILD_NUMBER} -clean'
        sh '/opt/hp_fortify_sca/bin/sourceanalyzer -64 -verbose -Xms2G -Xmx10G -b ${BUILD_NUMBER} "**/*" -exclude "client/node_modules/**/*" -exclude "admin/**/*" -exclude "build/**/*"'
        sh '/opt/hp_fortify_sca/bin/sourceanalyzer -64 -verbose -Xms2G -Xmx10G -b ${BUILD_NUMBER} -scan -f fortifyResults-${BUILD_NUMBER}.fpr'
    }

    stage ('PostFortifyResultsToThreadFix') {
        withCredentials([string(credentialsId: '33fb73c6-e993-45ee-8ffb-e4f850e26362', variable: 'THREADFIX_VARIABLE')]) {
        sh "/bin/curl -v --insecure -H 'Accept: application/json' -X POST --form file=@fortifyResults-${BUILD_NUMBER}.fpr\
            https://threadfix.devops.geointservices.io/rest/applications/175/upload?apiKey=${THREADFIX_VARIABLE}"
        }
    }
  
    stage ('Deploy') {
        withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'a8703712-1b39-4b55-9d80-18e84137bc22', passwordVariable: 'PCFPass', usernameVariable: 'PCFUser']]) {
          withEnv(["CF_HOME=${pwd()}"]) {
            sh "cf login -a api.system.dev.east.paas.geointservices.io -u $PCFUser -p $PCFPass -o USAF_Narwhal -s Development"
            sh "cf push"
          }
        }
    }
}
