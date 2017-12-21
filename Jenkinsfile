import static Constants.*

class Constants {
  static final REPO = 'internal-wouterdeschuyter-website'
  static final DOCKER_FOLDER = '~/docker/projects/' + REPO
  static final SERVER = 'server03.wouterdeschuyter.be'
}

node {
  try {
    stage('Checkout') {
      sh 'printenv'
      checkout scm
    }

    stage('Clean') {
      sh 'make clean'
    }

    stage('Dependencies') {
      sh 'make dependencies'
    }

    stage('Lint') {
      sh 'make lint'
    }

    stage('Build') {
      sh 'make build'
    }

    stage('Tests') {
      sh 'make test-unit'
    }

    stage('Deploy') {
      if (!env.BRANCH_NAME.equals('master')) {
        sh 'echo Not master branch, skip deploy.'
        return
      }

      // Push images to registry
      sh 'echo Pushing version'
      sh 'make push-latest'

      // Deploy production
      sh 'echo Deploying production'

      // Separate folder per environment
      def folder = DOCKER_FOLDER + '-prod';

      // Make directory, in case it doesn't exist
      sh 'ssh wouterds@'+SERVER+' "mkdir -p '+folder+'"'

      // Copy our docker-compose file to the server, in case it has changed
      sh 'scp docker/docker-compose-prod.yml wouterds@'+SERVER+':'+folder+'/docker-compose-prod.yml'
      sh 'scp docker/docker-prod.env wouterds@'+SERVER+':'+folder+'/docker-prod.env'

      // Deploy on production
      sh 'ssh wouterds@'+SERVER+' "cd '+folder+'; docker-compose -f docker-compose-prod.yml pull"'
      sh 'ssh wouterds@'+SERVER+' "cd '+folder+'; docker-compose -f docker-compose-prod.yml up -d"'

      // Run migrations
      sh 'ssh wouterds@'+SERVER+' "docker exec internalwouterdeschuyterwebsiteprod_php-fpm_1 php composer.phar migrations:migrate"'
    }
  } catch (e) {
    sh 'echo "Build failed!"'
    sh 'exit 1'
  } finally {
    // Clean up
    cleanWorkspace()
  }
}

def cleanWorkspace() {
  sh 'echo "Cleaning up workspace.."'
  deleteDir()
}
