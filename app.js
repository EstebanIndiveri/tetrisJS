document.addEventListener('DOMContentLoaded',()=>{
    let squares=Array.from(document.querySelectorAll('.grid div'));
    const grid=document.querySelector('.grid');
    const scoreDisplay=document.querySelector('#score');
    const startBtn=document.querySelector('.start-button');
    const reStartBtn=document.querySelector('.start');
    const width=10;
    let nextRandom=0;
    let timerId;
    let score=0
    const colors=[
        'orange',
        'red',
        'purple',
        'green',
        'blue'
    ]

        //tetr
        const lTetromino = [
            [1, width+1, width*2+1, 2],
            [width, width+1, width+2, width*2+2],
            [1, width+1, width*2+1, width*2],
            [width, width*2, width*2+1, width*2+2]
          ]
        
          const zTetromino = [
            [0,width,width+1,width*2+1],
            [width+1, width+2,width*2,width*2+1],
            [0,width,width+1,width*2+1],
            [width+1, width+2,width*2,width*2+1]
          ]
        
          const tTetromino = [
            [1,width,width+1,width+2],
            [1,width+1,width+2,width*2+1],
            [width,width+1,width+2,width*2+1],
            [1,width,width+1,width*2+1]
          ]
        
          const oTetromino = [
            [0,1,width,width+1],
            [0,1,width,width+1],
            [0,1,width,width+1],
            [0,1,width,width+1]
          ]
        
          const iTetromino = [
            [1,width+1,width*2+1,width*3+1],
            [width,width+1,width+2,width+3],
            [1,width+1,width*2+1,width*3+1],
            [width,width+1,width+2,width+3]
          ]
        
          const theTetrominoes=[lTetromino,zTetromino,tTetromino,oTetromino,iTetromino];


          let currentPosition=4;
          let currentRotation=0;

          //random
          let random=Math.floor(Math.random()*theTetrominoes.length);
          let current=theTetrominoes[random][currentRotation];
          
        //rotation first
        
        function draw(){
            current.forEach(index=>{
                squares[currentPosition+index].classList.add('tetromino');
                squares[currentPosition+index].style.backgroundColor=colors[random]
            })
        }
        //undraw
        function udraw(){
            current.forEach(index=>{
                squares[currentPosition+index].classList.remove('tetromino')
                squares[currentPosition+index].style.backgroundColor='';
            })
        }

        //settime
        // timerId=setInterval(moveDown,200);


        //cntrl KEY
        function control(e){
            if(e.keyCode===37){
                moveLeft();
            }else if(e.keyCode===38){
                rotate();
            }else if(e.keyCode===39){
                moveRight();
            }else if(e.keyCode===40){
                moveDown();
            }
        }
        document.addEventListener('keyup',control)

        //movedown
        function moveDown(){
            udraw();
            currentPosition+=width;
            draw();
            freeze();
        }


        function freeze(){
            if(current.some(index =>squares[currentPosition+index+width].classList.contains('taken'))){
                current.forEach(index=>squares[currentPosition+index].classList.add('taken'))
                random=nextRandom;
                nextRandom=Math.floor(Math.random()*theTetrominoes.length)
                current=theTetrominoes[random][currentRotation]
                currentPosition=4;
                draw();
                displayShape();
                addScore();
                gameOver();
            }
        }

        //move left 
        function moveLeft(){
            udraw();
            const isAtLeftEdge=current.some(index=>(currentPosition+index)%width===0)

            if(!isAtLeftEdge){
                currentPosition-=1;
            }
            if(current.some(index=>squares[currentPosition+index].classList.contains('taken'))){
                currentPosition+=1;
            }
            draw();
        }

        //right
        function moveRight(){
            udraw();
            const isAtRightEdge=current.some(index=>(currentPosition+index) % width===width-1)
                if(!isAtRightEdge){
                    currentPosition+=1
                }
                if(current.some(index=>squares[currentPosition+index].classList.contains('taken'))){
                    currentPosition-=1
                }
                draw();
        }


        //rotate
        function rotate(){
            udraw();
            currentRotation++;
            if(currentRotation === current.length){
                currentRotation=0;
            }
            current=theTetrominoes[random][currentRotation]
            draw();
        }


        //nextup
        const displaySquares=document.querySelectorAll('.mini-grid div');
        const displayWidth=4;
        let displayIndex=0;

        //withoutrotation
        const upNexstTetrominoes=[
            [1,displayWidth+1,displayWidth*2+1, 2],
            [0,displayWidth,displayWidth+1,displayWidth*2+1],
            [1,displayWidth,displayWidth+1,displayWidth+2],
            [0,1,displayWidth,displayWidth+1],
            [1,displayWidth+1,displayWidth*2+1,displayWidth*3+1]
        ]

        //minig
        function displayShape(){
            displaySquares.forEach(square=>{
                square.classList.remove('tetromino');
                square.style.backgroundColor='';
            });
            upNexstTetrominoes[nextRandom].forEach(index=>{
                displaySquares[displayIndex+index].classList.add('tetromino');
                displaySquares[displayIndex+index].style.backgroundColor=colors[nextRandom];
            })
        }

        //start
        startBtn.addEventListener('click',()=>{
            if(timerId){
                clearInterval(timerId);
                timerId=null
            }else{
                draw();
                timerId=setInterval(moveDown,1000);
                // if(score)
                nextRandom=Math.floor(Math.random()*theTetrominoes.length);
                displayShape();
            }
        })

        //add score
        function addScore(){
            for(let i=0;i<199;i+=width){
                const row=[i,i+1,i+2,i+3,i+4,i+5,i+6,i+7,i+8,i+9]

                if(row.every(index=>squares[index].classList.contains('taken'))){
                    score+=10;
                    scoreDisplay.innerHTML=score;
                    if(score>10){
                        timerId=setInterval(moveDown,950);
                        console.log('lvl2')
                    }
                    if(score>50){
                        timerId=setInterval(moveDown,900);
                        console.log('lvl3')
                    }
                    if(score>80){
                        timerId=setInterval(moveDown,890);
                        console.log('lvl4')
                    }
                    row.forEach(index=>{
                        squares[index].classList.remove('taken');
                        squares[index].classList.remove('tetromino');
                        squares[index].style.backgroundColor='';
                    })
                    const squaresRemoved=squares.splice(i,width)
                    squares=squaresRemoved.concat(squares);
                    squares.forEach(cell=>grid.appendChild(cell))                    
                }
            }
        }

        //gover
        function gameOver(){
            if(current.some(index=>squares[currentPosition+index].classList.contains('taken'))){
                scoreDisplay.innerHTML='End'
                clearInterval(timerId);
            }
        }

        reStartBtn.addEventListener('click',()=>{
            window.location.reload();
        })
})

