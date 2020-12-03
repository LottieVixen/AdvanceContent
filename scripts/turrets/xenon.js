const elib = require("effectlib");

const corruptEffect = newEffect(18, e => {
	Draw.color(Color.valueOf("59a7ff"), Color.white, e.fin());
	
	Fill.square(e.x, e.y, 0.1 + e.fout() * 2.8, 45);
});

const corrupted = new StatusEffect("corrupted");
corrupted.speedMultiplier = 0.985;
corrupted.armorMultiplier = 0.25;
corrupted.damageMultiplier = 0.333;
//corrupted.damage = 0.01;
corrupted.effect = corruptEffect;

const changeTeam = elib.newEffectWDraw(78, 512, e => {
	const type = e.data.getType();
	const base = e.data;
	const vec = new Vec2();
	//const weaponB = type.weapon.region;
	//print(e.data.getType());
	
	Draw.blend(Blending.additive);
	Draw.alpha(e.fout());
	Draw.mixcol(Color.valueOf("59a7ff"), 1);
	Draw.rect(type.region, base.x, base.y, base.rotation - 90);
	
	Draw.reset();
	Draw.blend();
});

const convertDamage = newEffect(67, e => {
	Draw.blend(Blending.additive);
	Draw.color(Color.valueOf("59a7ff"), Color.valueOf("59a7ff00"), e.fin());
	Fill.square(e.x, e.y, (7 * Vars.tilesize / 2));
	
	Draw.reset();
	Draw.blend();
});

const xenoLaser = extend(BasicBulletType, {
	update: function(b){
		Effect.shake(1.2, 1.2, b.x, b.y);
		if(b.timer.get(1, 5)){
			this.scanUnits(b);
			Damage.collideLine(b, b.team, this.hitEffect, b.x, b.y, b.vel.angle(), this.lengthB * 1.15, true);
		};
	},
	
	scanUnits: function(b){
		const vec = new Vec2();
		
		for(var i = 0; i < this.searchAccuracy; i++){
			vec.trns(b.vel.angle(), (this.lengthB / this.searchAccuracy) * i);
			vec.add(b.x, b.y);
			
			var radius = (this.lengthB / this.searchAccuracy) * 2;
			
			Units.nearbyEnemies(b.team, vec.x - radius, vec.y - radius, radius * 2, radius * 2, cons(unit => {
				if(unit != null){
					if(Mathf.within(vec.x, vec.y, unit.x, unit.y, radius) && unit.getTeam() != b.team && unit instanceof BaseUnit && !unit.isDead()){
						if(unit.health() < Math.max(unit.maxHealth() * 0.05, 85)){
							var lastUnit = unit;
							
							unit.kill();
							
							var newUnit = lastUnit.getType().create(b.team);
							newUnit.set(lastUnit.x, lastUnit.y);
							//newUnit.set(0, 0);
							newUnit.rotation = lastUnit.rotation;
							//newUnit.health = lastUnit.health();
							//newUnit.setSpawner(b.getOwner().tile);
							//newUnit.setSpawner(unit.noSpawner);
							//newUnit.health(lastUnit.health());
							newUnit.add();
							//print(newUnit.health());
							newUnit.health(lastUnit.health());
							newUnit.applyEffect(corrupted, Number.MAX_VALUE);
							//newUnit.health(newUnit.maxHealth() * 0.1);
							//newUnit.damage(newUnit.maxHealth() * 0.9);
							newUnit.velocity().set(lastUnit.velocity());
							
							Effect.effect(changeTeam, newUnit.x, newUnit.y, newUnit.rotation, newUnit);
							b.getOwner().damage(Math.min((newUnit.maxHealth() * 0.5), (b.getOwner().maxHealth() - 1)));
							Effect.effect(convertDamage, b.getOwner().x, b.getOwner().y);
							
							//health changes after spawn, that means you cant set its health
							
							//print(newUnit.health());
							
							//unit.kill();
							
							//print(newUnit);
							//unit.setSpawner(b.getOwner().getTile());
							//unit.getTeam() = b.team;
						}
					}
				}
			}));
		}
	},
	
	hit: function(b, hitx, hity){
		if(hitx != null && hity != null){
			Effect.effect(this.hitEffect, hitx, hity);
		}
	},
	
	draw: function(b){
		
		const colors = [Color.valueOf("59a7ff55"), Color.valueOf("59a7ffaa"), Color.valueOf("a3e3ff"), Color.valueOf("ffffff")];
		const tscales = [1, 0.74, 0.5, 0.24];
		const strokes = [2.3, 1.9, 1.4, 0.6];
		const lenscales = [1.0, 1.12, 1.15, 1.164];
		const tmpColor = new Color();

		for(var s = 0; s < 4; s++){
			Draw.color(tmpColor.set(colors[s]).mul(1.0 + Mathf.absin(Time.time, 1.2, 0.4)));
			for(var i = 0; i < 4; i++){
				Tmp.v1.trns(b.vel.angle() + 180.0, (lenscales[i] - 0.9) * 55.0);
				Lines.stroke((9 + Mathf.absin(Time.time, 1.7, 3.1)) * b.fout() * strokes[s] * tscales[i]);
				Lines.lineAngle(b.x + Tmp.v1.x, b.y + Tmp.v1.y, b.vel.angle(), this.lengthB * b.fout() * lenscales[i], false);
			}
		};
		Draw.reset();
	}
});

xenoLaser.searchAccuracy = 64;
xenoLaser.lengthB = 310;
xenoLaser.speed = 0.001;
xenoLaser.damage = 60;
xenoLaser.lifetime = 18;
xenoLaser.hitEffect = Fx.hitLancer;
xenoLaser.despawnEffect = Fx.none;
xenoLaser.hitSize = 7;
xenoLaser.drawSize = 720;
xenoLaser.pierce = true;
xenoLaser.shootEffect = Fx.none;
xenoLaser.smokeEffect = Fx.none;

const xeno = extendContent(LaserTurret, "xeno-corruptor",{
	load(){
		this.super$load();
		
		this.region = Core.atlas.find(this.name);
		this.baseRegion = Core.atlas.find("advancecontent-block-" + this.size);
		this.heatRegion = Core.atlas.find(this.name + "-heat");
	},
	
	generateIcons: function(){
	return [
		Core.atlas.find("advancecontent-block-" + this.size),
		Core.atlas.find(this.name)
	];},
	
	draw: function(tile){
		Draw.rect(this.baseRegion, tile.drawx(), tile.drawy());
	}
});
xeno.shootType = xenoLaser;
xeno.update = true;