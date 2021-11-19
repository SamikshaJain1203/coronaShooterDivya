//Game States
var PLAY=1;
var END=0;
var gameState=PLAY;
var life = 3;

var divya,injection ,virus,injectionGroup,enemyGroup, score,r,randominjection, position;
var divyaImage , injection, virusImage, gameOverImage
//var gameOverSound ,knifeSwoosh

function preload(){
  
  divyaImage = loadImage("girl.png");
  virusImage = loadAnimation("corona1.png","corona2.png")
  injectionImage = loadImage("flyling_vaccine.png");

  vaccinated = loadImage("vaccinated.png");

  gameOverImage = loadImage("gameoverskull.png")
  quarantineImg = loadImage("Quarantine.png");

   gameOverSound = loadSound("gameover.mp3")
 // knifeSwooshSound = loadSound("knifeSwoosh.mp3")
}

function setup() {
  createCanvas(1800,1800);
  
  //creating divya
  divya=createSprite(100,200,50,50);
  divya.addImage(divyaImage);
  divya.scale=0.5;
  
  //set collider for divya
  divya.setCollider("circle",0,0,40); 

  // Score variables and Groups
  score=0;
  injectionGroup=createGroup();
  enemyGroup=createGroup();
  
  restart_quarantine= createSprite(width/2,height/2);
  restart_quarantine.addImage(quarantineImg);
  //restart_quarantine.scale = 1;
  restart_quarantine.visible = false;
  restart_quarantine.depth = divya.depth;
  divya.depth = divya.depth + 1;

  restart_vaccinated = createSprite(width/2,height/2);
  restart_vaccinated.addImage(vaccinated);
 // restart_vaccinated.scale = 0.5;
  restart_vaccinated.visible = false;
  restart_vaccinated.depth = divya.depth;
  divya.depth = divya.depth + 1;

  gameOver = createSprite(width/2,height/2- 120);
  gameOver.addImage(gameOverImage);
  gameOver.scale = 1.1;
  gameOver.visible = false;
  
}


function draw() 
{
    background("black");
  
    textSize(22);
    fill("white");
    stroke("red");
    text(mouseX+ "," +mouseY, 800, 90)
    divya.y=World.mouseY;
    divya.x=World.mouseX;

    text("Score: " + score, 800, 40);
    text("Life: " + life, 800, 65);
    drawSprites();

  if(gameState===PLAY)
  { 
      //Call injections and Enemy function
      injections();
      Enemy();
    
    // Increase score if divya touching injection
    if(injectionGroup.isTouching(divya))
    {
        score=score+2;
        restart_vaccinated.visible = true;
        restart_quarantine.visible = false;
        injectionGroup[0].destroy();
     
    }

     // Go to end state if divya touching enemy
     if(enemyGroup.isTouching(divya))
     {
       gameState = END;        
     }
  }

  else if (gameState === END)  
  {
    if (life > 0) {
      restart_quarantine.visible = true;
      restart_vaccinated.visible = false;

      text("Restart", width/2-200,height/2-200 );
      reset();
    }
    else
    {
         //gameover sound
        gameOverSound.play(); 

        restart_quarantine.visible = false;
        restart_vaccinated.visible = false;
        gameOver.visible = true;
             
        divya.destroy();
        injectionGroup.destroyEach();
        enemyGroup.destroyEach();

        injectionGroup.setVelocityXEach(0);
        enemyGroup.setVelocityXEach(0);

        //set lifetime of the game objects so that they are never destroyed
        injectionGroup.setLifetimeEach(-1);
        enemyGroup.setLifetimeEach(-1);
    } 
  }
}

function Enemy(){
  if(World.frameCount % 150===0)
  {
     var virus = createSprite(width+20,200,30,10);
     virus.y = Math.round(random(100,1000));

    virus.addAnimation("moving", virusImage);
    virus.scale = 0.7;

    virus.velocityX=-(8+(score/10));
    virus.setLifetime=200;

    virus.depth = divya.depth;
    divya.depth = divya.depth + 1;
    
    enemyGroup.add(virus);
  }
}

function injections() {
  //write code here to create the injection
  if (frameCount % 250 === 0) 
  {
    var injection = createSprite(width+20, 150, 40, 10);
    injection.y = Math.round(random(100,1000));
    injection.addImage(injectionImage);
    injection.scale = 0.5;
    injection.velocityX = -5;

    //assign lifetime to the variable
    injection.lifetime = 500;

    //adjust the depth
    injection.depth = divya.depth;
    divya.depth = divya.depth + 1;

    //add each injection to the group
    injectionGroup.add(injection);
  }

}

function reset() 
{
    life = life - 1;
    gameState = PLAY;
   // score = 0; 

   enemyGroup.destroyEach();
   injectionGroup.destroyEach();

   if (localStorage["HighestScore"] < score) 
  {
    localStorage["HighestScore"] = score;
  }
}
