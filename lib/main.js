window.addEventListener('load', () => {
	// let game = new Game();
	// console.log();

	const game = new Game();
	game.init();
})

class Disc {

	static x = 300
	static y = 500
	static r = 20
	
	static create() {
		return Matter.Bodies.rectangle(Disc.x, Disc.y, 30, 5, { 
			density: 0.05,
			friction: 0.7,
			frictionAir: 0.01,
		})
	}
}

class Target {

	static create() {
		let target = Matter.Composite.create();

		let stand = Matter.Bodies.rectangle(0, 65, 6, 50, { density: 0.7, friction: 0.8, isStatic: true })
		let basketBase = Matter.Bodies.rectangle(0, 35, 50, 10, { density: 0.7, friction: 0.8, isStatic: true })
		let basketWall = Matter.Bodies.rectangle(30, 0, 10, 80, { density: 0.7, friction: 0.8, isStatic: true })

		Matter.Composite.add(target, stand);
		Matter.Composite.add(target, basketBase);
		Matter.Composite.add(target, basketWall);

		Matter.Composite.translate(target, { x: 1000, y: 450 })

		return target
	}
}

class Game {
	constructor() {
		this.firing = false
		this.engine = null

		this.disc = null
		this.sling = null
	}

	init() {
		// module aliases
		this.engine = Matter.Engine.create();

		let render = Matter.Render.create({
			element: document.body,
			engine: this.engine,
			options: {
				width: 1200,
				height: 800,
				wireframes: true
			}
		});

		let ground = Matter.Bodies.rectangle(1200, 550, 1200, 20, { isStatic: true });

		this.disc = Disc.create();
		this.sling = Matter.Constraint.create({
			pointA: { x: 300, y: 500 },
			bodyB: this.disc,
			stiffness: 0.005,
			damping: 0.03,
			render: { lineWidth: 0.5 }
		});

		let target = Target.create();
		
		let mouse = Matter.Mouse.create(render.canvas);
		let mouseConstraint = Matter.MouseConstraint.create(this.engine, {
			mouse: mouse,
			constraint: {
				render: { visible: false }
			}
		});
		render.mouse = mouse;

		Matter.Events.on(mouseConstraint, 'enddrag', (e) => this.onEndDrag(e));
		Matter.Events.on(this.engine, 'afterUpdate', (e) => this.onAfterUpdate(e));
		Matter.Events.on(this.engine, 'beforeUpdate', (e) => this.onBeforeUpdate(e));

		Matter.World.add(this.engine.world, [target, ground, this.disc, this.sling, mouseConstraint]);
		Matter.Engine.run(this.engine);
		Matter.Render.run(render);
	}

	onBeforeUpdate(event) {
		Matter.Body.applyForce(
			this.disc, 
			Matter.Vector.create(this.disc.position.x, 800), 
			{x: 0, y: -0.005}
		)
	}

	onEndDrag(event) {
		if (event.body === this.disc) this.firing = true;
	}

	onAfterUpdate(event) {
		if (this.firing && Math.abs(this.disc.position.x - this.sling.pointA.x) < 20 && Math.abs(this.disc.position.y - this.sling.pointA.y) < 20) {
			// this.disc = disc.create()
			// Matter.World.add(this.engine.world, this.disc);
			this.sling.bodyB = null;
			this.sling.render.visible = false
			this.firing = false;
		}
	}

}