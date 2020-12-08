const stormCharge = newEffect(27, e => {
	Draw.color(Color.valueOf("606571"), Color.valueOf("6c8fc7"), e.fin());
	const hh = new Floatc2({get: function(x, y){
		//Fill.poly(e.x + x, e.y + y, 6, 2 + e.fin() * 11, e.rotation);
		Fill.poly(e.x + x, e.y + y, 6, 1 + Mathf.sin(e.fin() * 3, 1, 2) * 5, e.rotation);
	}});
	
	Angles.randLenVectors(e.id, 2, e.fout() * 40.0, e.rotation, 135.0, hh);
});

const stormSmokeTwo = newEffect(15, e => {
	const trnsB = new Vec2();
	
	Draw.color(Color.valueOf("6c8fc7"), Color.valueOf("606571"), e.fin());
	trnsB.trns(e.rotation, e.fin() * (4.6 * 15));
	Fill.poly(e.x + trnsB.x, e.y + trnsB.y, 6, e.fout() * 16, e.rotation);
});

const stormSmoke = newEffect(27, e => {
	//const trnsB = new Vec2();
	
	Draw.color(Color.valueOf("6c8fc7"), Color.valueOf("606571"), e.fin());
	const hl = new Floatc2({get: function(x, y){
		//trnsB.trns(e.rotation, e.fin() * (4.6 * 60));
		//Draw.color(Color.valueOf("a9d8ff"), Color.valueOf("8494b3"), e.fin());
		Fill.poly(e.x + x, e.y + y, 6, e.fout() * 9, e.rotation);
	}});
	
	Angles.randLenVectors(e.id, 3, e.finpow() * 20.0, e.rotation, 180.0, hl);
});

const stormBullet = extend(BasicBulletType, {
	update: function(b){
		const trnsC = new Vec2();
		const trnsD = new Vec2();
		
		if(Mathf.chance(0.9)){
			Effect.effect(stormSmoke, this.backColor, b.x + Mathf.range(2.0), b.y + Mathf.range(2.0), b.vel.angle());
		};

		if(Mathf.chance(Math.min(Core.graphics.getDeltaTime() * 60, 3) * 0.7)){
			trnsC.trns(b.vel.angle() + Mathf.range(2.0), 13);
			Lightning.create(b.team, Color.valueOf("a9d8ff"), 31, b.x + trnsC.x + Mathf.range(12.0), b.y + trnsC.y + Mathf.range(12.0), b.vel.angle() + Mathf.range(56.0), Mathf.random(4, 22));
		};
		if(Mathf.chance(Math.min(Core.graphics.getDeltaTime() * 60, 3) * 0.3)){
			trnsD.trns(b.vel.angle() + Mathf.range(2.0), 13);
			Lightning.create(b.team, Color.valueOf("8494b3"), 17, b.x + trnsD.x + Mathf.range(12.0), b.y + trnsD.y + Mathf.range(12.0), b.vel.angle() + Mathf.range(180.0), Mathf.random(3, 12));
		};
		Effect.effect(stormSmokeTwo, this.backColor, b.x + Mathf.range(12.9), b.y + Mathf.range(12.9), b.vel.angle() + Mathf.range(2.0));
	},
	
	draw: function(b){
		Draw.color(Color.valueOf("6c8fc7"), Color.valueOf("606571"), b.fin());
		Fill.poly(b.x, b.y, 6, 6 + b.fout() * 6.1, b.vel.angle());
		Draw.reset();
	}
});

stormBullet.speed = 4.6;
stormBullet.damage = 8.6;
stormBullet.lifetime = 53;
stormBullet.hitSize = 28;
stormBullet.shootEffect = Fx.none;
stormBullet.despawnEffect = Fx.none;
stormBullet.collides = true;
stormBullet.collidesTiles = false;
stormBullet.collidesAir = true;
stormBullet.pierce = true;

const trb = new Vec2();
const storm = extendContent(PowerTurret, "storm", {
	"description": "A powerful version of Arc Caster.",
	"chargeTime": 130,
	"chargeMaxDelay": 24,
	"health": 7600,
	"size": 4,
	"reloadTime": 180,
	"range": 210,
	"shootCone": 30,
	"heatColor": "CCFFFF",
	"ammoUseEffect": "none",
	"shootEffect": "none",
	"inaccuracy": 11.2,
	"rotateSpeed": 5.5,
	"recoilAmount": 2,
	"powerUse": 33.4,
	"hasPower": true,
	"targetAir": true,
	"shootSound": "flame",
	"cooldown": 0.01,
	"requirements": [
		{ "item": "silicon", "amount": 320 },
		{ "item": "chromium", "amount": 480 },
		{ "item": "lanthanum", "amount": 290 },
		{ "item": "advance-alloy", "amount": 210 },
		{ "item": "titanium", "amount": 370 }
	],
	"category": "turret",
	"research": "arc-caster"
});

storm.shootType = stormBullet;
//storm.burstSpacing = 6;
storm.shots = 5;
storm.shootEffect = Fx.none;
//storm.chargeMaxDelay = 24;
storm.chargeEffects = 5;
storm.chargeEffect = stormCharge;