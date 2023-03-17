const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var rope,fruit,ground;
var fruit_con;

var bg_img;
var food;
var rabbit;

var button;
var bunny;

function preload()
{
  bg_img = loadImage('background.png');
  food = loadImage('melon.png');
  blinkingRabbit = loadAnimation("blink_1.png","blink_2.png","blink_3.png")
  eatingRabbit = loadAnimation ("eat_0.png","eat_1.png","eat_2.png","eat_3.png","eat_4.png")
  sadRabbit = loadAnimation ("sad_1.png","sad_2.png","sad_3.png")
  blinkingRabbit.playing=true
  eatingRabbit.playing = true
  sadRabbit.playing = true
  eatingRabbit.looping = false
  sadRabbit.looping = false

  backgroundMusic = loadSound ("sound1.mp3")
  sadSound = loadSound ("sad.wav")
  cutSound= loadSound ("rope_cut.mp3")
  eating = loadSound ("eating_sound.mp3")
  airSound = loadSound ("air.wav")


  eStar=loadImage ("g_star1.png")
  star=loadImage("star.png")

}

function setup() {
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  if (isMobile) {
    w=displayWidth
    h=displayHeight
    createCanvas(w,h)
  }else{
    w=windowWidth
    h=windowHeight
    createCanvas(w,h)
  }
  frameRate(80);

  engine = Engine.create();
  world = engine.world;

  eStar1=createSprite (50,50)
  eStar1.addImage ("empty",eStar)
  eStar1.scale = 0.1
  eStar1.addImage ("fill",star)

  eStar2=createSprite (120,50)
  eStar2.addImage ("empty",eStar)
  eStar2.scale = 0.1
  eStar2.addImage ("fill",star)

  star1=createSprite (200,h/2)
  star1.addImage ("fill",star)
  star1.scale = 0.04
  
  star2=createSprite (w/2-300,100)
  star2.addImage ("fill",star)
  star2.scale = 0.04

  button = createImg('cut_btn.png');
  button.position(220,30);
  button.size(50,50);
  button.mouseClicked(drop);

  button2 = createImg('cut_btn.png');
  button2.position(w/2,100);
  button2.size(50,50);
  button2.mouseClicked(drop2);

  button3 = createImg('cut_btn.png');
  button3.position(w/2+200,h/2);
  button3.size(50,50);
  button3.mouseClicked(drop3);
  
  rope = new Rope(10,{x:245,y:30});
  rope2 = new Rope(10,{x:w/2+25,y:100});
  rope3 = new Rope(10,{x:w/2+225,y:h/2});
  ground = new Ground(200,h,w,20);

  blinkingRabbit.frameDelay = 15
  eatingRabbit.frameDelay = 15
  sadRabbit.frameDelay = 15

  bunny = createSprite(400,h-80,100,100);
  bunny.addAnimation ("blink",blinkingRabbit)
  bunny.addAnimation ("eat", eatingRabbit)
  bunny.addAnimation ("sad", sadRabbit)

  backgroundMusic.play()
  backgroundMusic.setVolume (0.3)

  bunny.scale = 0.2;

  fruit = Bodies.circle(300,300,20);
  Matter.Composite.add(rope.body,fruit);

  fruit_con = new Link(rope,fruit);
  fruit_con2 = new Link(rope2,fruit);
  fruit_con3 = new Link(rope3,fruit);

  balloon=createImg ("balloon.png")
  balloon.position (10,250)
  balloon.size (150,100)
  balloon.mouseClicked(airblow)

  balloon2=createImg ("balloon 2.png")
  balloon2.position (w/2-200,h-250)
  balloon2.size (100,150)
  balloon2.mouseClicked(airblow2)


  muteButton = createImg ("mute.png")
  muteButton.position (w-100,20)
  muteButton.size (50,50)
  muteButton.mouseClicked (mute)

  rectMode(CENTER);
  ellipseMode(RADIUS);
  imageMode(CENTER);
  
}

function draw() 
{
  background(51);
  image(bg_img,width/2,height/2,w,h);
  if ( fruit!=null) {
    image(food,fruit.position.x,fruit.position.y,70,70);
  }
  

  rope.show();
  rope2.show();
  rope3.show();
  Engine.update(engine);
  ground.show();

  if (collide(fruit,bunny,80)== true) {
    World.remove (world,fruit)
    fruit = null
    bunny.changeAnimation("eat")
    eating.play ()
  }
  if (fruit!=null&&fruit.position.y>h-50) {
    bunny.changeAnimation ("sad")
   sadSound.play ()
   backgroundMusic.stop ()
   fruit=null
  }
  if (collide(fruit,star1,50)==true) {
    star1.visible=false
    eStar1.changeImage("fill")
    eStar1.scale=0.03
  }

  if (collide(fruit,star2,50)==true) {
    star2.visible=false
    eStar2.changeImage("fill")
    eStar2.scale=0.03
  }
   drawSprites();
}

function drop()
{
  rope.break();
  fruit_con.dettach();
  fruit_con = null; 
  cutSound.play ()
}
function drop2()
{
  rope2.break();
  fruit_con2.dettach();
  fruit_con2 = null; 
  cutSound.play ()
}
function drop3()
{
  rope3.break();
  fruit_con3.dettach();
  fruit_con3 = null; 
  cutSound.play ()
}

function collide (body,sprite,x) {
 if (body!=null) {
  var d = dist (body.position.x,body.position.y,sprite.position.x,sprite.position.y)
  if (d<=x) {
    
    return true
  }
  else {
    return false
  }
 }
}

function airblow () {
  Matter.Body.applyForce (fruit,fruit.position,{x:0.01,y:0})
  airSound.play ()
}

function airblow2 () {
  Matter.Body.applyForce (fruit,fruit.position,{x:0,y:-0.02})
  airSound.play ()
}

function mute () {
 if (backgroundMusic.isPlaying()) {
  backgroundMusic.stop ()
 }
 else {
  backgroundMusic.play ()
 }
}