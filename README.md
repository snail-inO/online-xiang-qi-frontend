# online-xiang-qi-frontend
An online Xiang Qi (Chinese Chess) game web app frontend

## Description
The project is a web application implements an AI using Monte Carlo Tree Search algorithm with a Convolutional Neural Network in a Chinese Chess Game.\
The tree-based AI has a reasonable performance when the rollout times is larger than 50 and depth limit is larger than 100. However, the tree-based AI integrated with NN has worse performance than the tree-based AI without NN, which is possibly due to the inappropriate utility evaluation and the incorrect design of NN model.\
The project contains three modules: [backend server](https://github.com/snail-inO/online-xiang-qi.git), frontend application, and [NN module](https://github.com/snail-inO/online-xiang-qi.git).

## Get Started
### Prerequisites
* [Docker](https://www.docker.com/) (version = 20.10.17)

### Deployment
#### [Backend](https://github.com/snail-inO/online-xiang-qi.git)
1. Clone the repository: `$ git clone https://github.com/snail-inO/online-xiang-qi.git`
2. Go to the project code directory: `$ cd online-xiang-qi/code`
3. Start Docker client
4. Run containers: `$ docker-compose up` (need to run after building Docker image of frontend, Frontend step4)
#### Frontend
1. Clone the repository: `$ git clone https://github.com/snail-inO/online-xiang-qi-frontend.git`
2. Go to the project directory: `$ cd online-xiang-qi-frontend`
3. Start Docker client
4. Build docker image: `$ docker build -t front .`

### Usage
1. Access http://localhost:3000 on a browser
2. Enter a user name
3. Select game modes and problem size (opponet mode cannot set to user mode if your mode isn't user mode)
4. Red player moves first
5. Perform a move
  1. (User mode) Click on the piece of your color to select the piece (click one more time to unselect) and click on a valid position on the board to move
  2. (AI mode) Click `Next` button to perform a move (Do not click the button if opponent's move is not completed)
6. Wait until opponent's move is completed, then repeat step 5
7. If you do not perform an action longer than 60 seconds, you will lose the game

## Licence
This project is licensed under the [GPLv2 License](LICENSE).
