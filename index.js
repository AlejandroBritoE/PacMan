const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d');

const scoreEl = document.querySelector('#scoreEl')

canvas.width = innerWidth
canvas.height = innerHeight

class Boundary {
    static width = 40
    static height = 40
    constructor({position,image}){
        this.position = position
        this.width = 40
        this.height = 40
        this.image = image
    }
    draw() {
        
        ctx.drawImage(this.image,this.position.x,this.position.y)
    }
} 


class Player{
    constructor({position,velocity})
    {
        this.position = position
        this.velocity = velocity
        this.radius = 15
        this.radians = 0.7  
        this.openrate = 0.12
        this.rotation = 0
    }

    draw(){
        ctx.save()
        ctx.translate(this.position.x, this.position.y)
        ctx.rotate(this.rotation)
        ctx.translate(-this.position.x, -this.position.y)
        ctx.beginPath()
        ctx.arc(this.position.x,
                this.position.y,
                this.radius,
                this.radians,
                Math.PI * 2 - this.radians,)
        ctx.lineTo(this.position.x, this.position.y)
        ctx.fillStyle='yellow'
        ctx.fill()
        ctx.closePath()
        ctx.restore()
    }
    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.radians < 0 || this.radians > 0.75) this.openrate
        = -this.openrate

        this.radians += this.openrate
    }
}


class Ghost{
  static speed = 2
  constructor({position,velocity,color = 'red' })
  {
      this.position = position
      this.velocity = velocity
      this.radius = 15
      this.color = color
      this.prevcollisions = []
      this.speed = 2
      this.scared = false
  }

  draw(){
      ctx.beginPath()
      ctx.arc(this.position.x,this.position.y,this.radius,0,Math.PI * 2,)
      ctx.fillStyle = this.scared ? 'blue' :  this.color
      ctx.fill()
      ctx.closePath()
  }
  update(){
      this.draw()
      this.position.x += this.velocity.x
      this.position.y += this.velocity.y
  }
}

class Pellet{
    constructor({position})
    {
        this.position = position
        this.radius = 3
    }

    draw(){
        ctx.beginPath()
        ctx.arc(this.position.x,this.position.y,this.radius,0,Math.PI * 2,)
        ctx.fillStyle='white'
        ctx.fill()
        ctx.closePath()
    }
}

class Powerup{
  constructor({position})
  {
      this.position = position
      this.radius = 8
  }

  draw(){
      ctx.beginPath()
      ctx.arc(this.position.x,this.position.y,this.radius,0,Math.PI * 2,)
      ctx.fillStyle='white'
      ctx.fill()
      ctx.closePath()
  }
}

const pellets = []
const boundaries = []
const Powerups = []
const ghosts = [
  new Ghost({
    position:{
      x:Boundary.width * 6 + Boundary.width / 2,
      y:Boundary.height + Boundary.height / 2
    },
    velocity:{
      x:Ghost.speed,
      y:0
    }
  }),

  new Ghost({
    position:{
      x:Boundary.width * 6 + Boundary.width / 2,
      y:Boundary.height * 3 + Boundary.height / 2
    },
    velocity:{
      x:Ghost.speed,
      y:0
    },
    color: 'blue'
  }),

  new Ghost({
    position:{
      x:Boundary.width * 6 + Boundary.width / 2,
      y:Boundary.height * 3 + Boundary.height / 2
    },
    velocity:{
      x:Ghost.speed,
      y:0
    },
    color: 'purple'
  })

  
]
const player = new Player({
    position:{
        x:Boundary.width + Boundary.width / 2,
        y:Boundary.height + Boundary.height / 2
    },
    velocity:{
        x:0,
        y:0
    }
})

const keys={
    w:{
        pressed:false
    },
    a:{
        pressed:false
    },
    s:{
        pressed:false
    },
    d:{
        pressed:false
    }
}

let lastkey =''
let score = 0

const map = [
    ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
    ['|', 'p', '.', '.', '.', '.', '.', '.', '.', 'p', '|'],
    ['|', '.', 'b', '.', '[', '7', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '5', ']', '.', 'b', '.', '|'],
    ['|', 'p', '.', '.', '.', '.', '.', '.', '.', 'p', '|'],
    ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3']
  ]


function createImage(src){
    const image = new Image ()
    image.src = src
    return image
}


map.forEach((row, i) => {
    row.forEach((symbol, j) => {
      switch (symbol) {
        case '-':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i
              },
              image: createImage('img/pipeHorizontal.png')
            })
          )
          break
        case '|':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i
              },
              image: createImage('img/pipeVertical.png')
            })
          )
          break
        case '1':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i
              },
              image: createImage('img/pipeCorner1.png')
            })
          )
          break
        case '2':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i
              },
              image: createImage('img/pipeCorner2.png')
            })
          )
          break
        case '3':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i
              },
              image: createImage('img/pipeCorner3.png')
            })
          )
          break
        case '4':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i
              },
              image: createImage('img/pipeCorner4.png')
            })
          )
          break
        case 'b':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i
              },
              image: createImage('img/block.png')
            })
          )
          break
        case '[':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              image: createImage('img/capLeft.png')
            })
          )
          break
        case ']':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              image: createImage('img/capRight.png')
            })
          )
          break
        case '_':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              image: createImage('img/capBottom.png')
            })
          )
          break
        case '^':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              image: createImage('img/capTop.png')
            })
          )
          break
        case '+':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              image: createImage('img/pipeCross.png')
            })
          )
          break
        case '5':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              color: 'blue',
              image: createImage('img/pipeConnectorTop.png')
            })
          )
          break
        case '6':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              color: 'blue',
              image: createImage('img/pipeConnectorRight.png')
            })
          )
          break
        case '7':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              color: 'blue',
              image: createImage('img/pipeConnectorBottom.png')
            })
          )
          break
        case '8':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              image: createImage('img/pipeConnectorLeft.png')
            })
          )
          break
        case '.':
          pellets.push(
            new Pellet({
              position: {
                x: j * Boundary.width + Boundary.width / 2,
                y: i * Boundary.height + Boundary.height / 2
              }
            })
          )
          break
          case 'p':
            Powerups.push(
              new Powerup({
                position: {
                  x: j * Boundary.width + Boundary.width / 2,
                  y: i * Boundary.height + Boundary.height / 2
                }
              })
            )
            break  
      }
    })
  })

function circlecollideswithrectangle({circle, rectangle}) {
  const padding = Boundary.width /2 - circle.radius - 1
    return (circle.position.y - circle.radius + circle.velocity.y <= rectangle.position.y + rectangle.height + padding 
        &&  circle.position.x + circle.radius + circle.velocity.x >= rectangle.position.x - padding 
        &&  circle.position.y + circle.radius + circle.velocity.y >= rectangle.position.y - padding 
        &&  circle.position.x - circle.radius + circle.velocity.x <= rectangle.position.x + rectangle.width + padding)
}

let animationId
function animate() {
    animationId = requestAnimationFrame(animate)
    ctx.clearRect(0,0,canvas.width,canvas.height)

    if       (keys.w.pressed && lastkey === 'w'){
       for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries [i]
        if(
            circlecollideswithrectangle({
            circle:{
                ...player,
                velocity: {
                x: 0,
                y:-5
            }
        },
            rectangle:boundary
        })
        ) {
            player.velocity.y = 0
            break
        } else {
            player.velocity.y = -5
        }
    }
       
    } else if(keys.a.pressed && lastkey === 'a'){
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries [i]
            if(
                circlecollideswithrectangle({
                circle:{
                    ...player,
                    velocity: {
                    x:-5,
                    y: 0
                }
            },
                rectangle:boundary
            })
            ) {
                player.velocity.x = 0
                break
            } else {
                player.velocity.x = -5
            }
        }
    } else if(keys.s.pressed && lastkey === 's'){
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries [i]
            if(
                circlecollideswithrectangle({
                circle:{
                    ...player,
                    velocity: {
                    x: 0,
                    y: 5
                }
            },
                rectangle:boundary
            })
            ) {
                player.velocity.y = 0
                break
            } else {
                player.velocity.y = 5
            }
        }
    } else if(keys.d.pressed && lastkey === 'd'){
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries [i]
            if(
                circlecollideswithrectangle({
                circle:{
                    ...player,
                    velocity: {
                    x: 5,
                    y: 0
                }
            },
                rectangle:boundary
            })
            ) {
                player.velocity.x = 0
                break
            } else {
                player.velocity.x = 5
            }
        }
    }

    

// detectar colision entre fantasma y jugador

// codigo de deteccion de choque
  for (let i = ghosts.length - 1; 0 <= i; i --) {
    const ghost = ghosts [i]

      if (Math.hypot(
          ghost.position.x - player.position.x, 
          ghost.position.y - player.position.y
        ) < 
          ghost.radius + player.radius 
      ) {

        if (ghost.scared){
          ghosts.splice(i,1)

        } else {

          cancelAnimationFrame(animationId)
       }    
    }
  }

// condicion para ganar


  if (pellets.length === 0){

    cancelAnimationFrame(animationId)
  } 


  for (let i = Powerups.length - 1; 0 <= i; i --) {
    const Powerup = Powerups [i]
    Powerup.draw()

      if (
        Math.hypot(
          Powerup.position.x - player.position.x, 
          Powerup.position.y - player.position.y
        ) < 
          Powerup.radius + player.radius
      ){

        Powerups.splice(i,1)

        ghosts.forEach(ghost => {
          ghost.scared = true
         
          setTimeout(( ) => {
            ghost.scared = false


          }, 5000 )
        })

      }

    }

    for (let i = pellets.length - 1; 0 <= i; i --) {
        const pellet = pellets [i]
        pellet.draw()
        
        if (
          Math.hypot(
            pellet.position.x - player.position.x, 
            pellet.position.y - player.position.y
          ) < 
            pellet.radius + player.radius
        ) {
            
            pellets.splice(i,1)
            score += 10
            scoreEl.innerHTML = score
    
            }
            }
 

    boundaries.forEach((boundary) => {
    boundary.draw()

if  ( 
    circlecollideswithrectangle({
        circle: player,
        rectangle: boundary
    })
    ) {        
        player.velocity.x = 0
        player.velocity.y = 0
    }

    })

player.update()

  ghosts.forEach((ghost) => {
    ghost.update()

// toque con el fantasma    

 

    const collisions = []
    boundaries.forEach(boundary => {
      if(
        !collisions.includes('right') &&
        circlecollideswithrectangle({
          circle:{
            ...ghost,
            velocity: {
              x: ghost.speed,
              y: 0
            }
          },
          rectangle:boundary
        })
      ) {
        collisions.push('right')
      }

      if(
        !collisions.includes('left') &&
        circlecollideswithrectangle({
          circle:{
            ...ghost,
            velocity: {
              x: -ghost.speed,
              y: 0
            }
          },
          rectangle:boundary
        })
      ){
  collisions.push('left')
}

      if(
        !collisions.includes('up') &&
        circlecollideswithrectangle({
          circle:{
          ...ghost,
      velocity: {
      x: 0,
      y: -ghost.speed
  }
},
  rectangle:boundary
})
){
collisions.push('up')
}

if(
  !collisions.includes('down') &&
  circlecollideswithrectangle({
  circle:{
      ...ghost,
      velocity: {
      x: 0,
      y: ghost.speed
  }
},
          rectangle:boundary
        })
      ) {
        collisions.push('down')
      }
      })
      
    if (collisions.length > ghost.prevcollisions.length)
      ghost.prevcollisions = collisions

    if (JSON.stringify(collisions) !== JSON.stringify(ghost.prevcollisions)) {

      if      (ghost.velocity.x > 0) ghost.prevcollisions.push('right')
      else if (ghost.velocity.x < 0) ghost.prevcollisions.push('left')
      else if (ghost.velocity.y > 0) ghost.prevcollisions.push('up')
      else if (ghost.velocity.y < 0) ghost.prevcollisions.push('down')

  
  const pathways = ghost.prevcollisions.filter(collision => {
    return !collisions.includes(collision)
  })

    const direction = pathways[Math.floor(Math.random() * pathways.length)]

    switch(direction){
      case 'down': 
      ghost.velocity.y = ghost.speed
      ghost.velocity.x = 0
      break

        case 'up': 
          ghost.velocity.y = -ghost.speed
          ghost.velocity.x = 0
          break

        case 'right': 
          ghost.velocity.y = 0
          ghost.velocity.x = ghost.speed
          break

        case 'left': 
          ghost.velocity.y = 0
          ghost.velocity.x = -ghost.speed
          break
      }

      ghost.prevcollisions = []

    }
  })

  if (player.velocity.x > 0) player.rotation = 0
  else if (player.velocity.x < 0) player.rotation = Math.PI
  else if (player.velocity.y > 0) player.rotation = Math.PI / 2
  else if (player.velocity.y > 0) player.rotation = Math.PI * 1.5
}


// fin de la animacion
animate()

addEventListener('keydown',({key}) => {
    
    switch(key){
        case 'w':
            keys.w.pressed=true
            lastkey='w'
        break
        case 'a':
            keys.a.pressed=true
            lastkey='a'
        break
        case 's':
            keys.s.pressed=true
            lastkey='s'
        break
        case 'd':
            keys.d.pressed=true
            lastkey='d'
        break            
    }

})

addEventListener('keyup',({key}) => {
    
    switch(key){
        case 'w':
            keys.w.pressed=false
        break
        case 'a':
            keys.a.pressed=false
        break
        case 's':
            keys.s.pressed=false
        break
        case 'd':
            keys.d.pressed=false
        break            
    }
    console.log(keys.d.pressed)
    console.log(keys.d.pressed)
})
