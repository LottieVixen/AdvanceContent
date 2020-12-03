const calamitylaser = extend(BasicBulletType, {
	
	update: function(b){
		Effect.shake(1.2, 1.2, b.x, b.y);
		if(b.timer.get(1, 5)){
			Damage.collideLine(b, b.team, this.hitEffect, b.x, b.y, b.vel.angle(), 340.0, true);
		};
		if(Mathf.chance(Math.min(Core.graphics.getDeltaTime() * 60, 3) * 0.2)){
			Tmp.v2.trns(b.vel.angle() + 90.0, Mathf.range(7.0));
			Lightning.create(b.team, Color.valueOf("ff9c5a"), 10, b.x + Tmp.v2.x, b.y + Tmp.v2.y, b.vel.angle(), 46);
		};
		if(Mathf.chance(Math.min(Core.graphics.getDeltaTime() * 60, 3) * 0.1)){
			Tmp.v3.trns(b.vel.angle(), Mathf.random(0.5, 340.0));
			Lightning.create(b.team, Color.valueOf("ff9c5a"), 16, b.x + Tmp.v3.x, b.y + Tmp.v3.y, Mathf.random(360), 12);
		}
	},
	
	hit: function(b, hitx, hity){
		if(hitx != null && hity != null){
			//Effect.effect(this.hitEffect, Color.valueOf("ec7458aa"), hitx, hity);
			//Effect.create​(this.hitEffect, hitx, hity, 0.0, Color.valueOf("ec7458aa"), null);
			this.hitEffect.at(hitx, hity, Color.valueOf("ec7458aa"));
			if(Mathf.chance(0.15)){
				Damage.createIncend(hitx, hity, 7, 1);
			}
		}
	},
	
	draw: function(b){
		
		const colors = [Color.valueOf("ec745855"), Color.valueOf("ec7458aa"), Color.valueOf("ff9c5a"), Color.valueOf("ffffff")];
		const tscales = [1, 0.7, 0.5, 0.24];
		const strokes = [3.1, 2.3, 1.6, 0.8];
		const lenscales = [1.0, 1.12, 1.15, 1.164];
		const tmpColor = new Color();

		for(var s = 0; s < 4; s++){
			Draw.color(tmpColor.set(colors[s]).mul(1.0 + Mathf.absin(Time.time, 1.0, 0.3)));
			for(var i = 0; i < 4; i++){
				Tmp.v1.trns(b.vel.angle() + 180.0, (lenscales[i] - 1.0) * 55.0);
				Lines.stroke((9 + Mathf.absin(Time.time, 1.4, 2.1)) * b.fout() * strokes[s] * tscales[i]);
				Lines.lineAngle(b.x + Tmp.v1.x, b.y + Tmp.v1.y, b.vel.angle(), 320.0 * b.fout() * lenscales[i], false);
			}
		};
		Draw.reset();
	}
});

calamitylaser.speed = 0.001;
calamitylaser.damage = 100;
calamitylaser.lifetime = 18;
calamitylaser.hitEffect = Fx.hitMeltdown;
calamitylaser.despawnEffect = Fx.none;
calamitylaser.hitSize = 5;
calamitylaser.drawSize = 660;
calamitylaser.pierce = true;
calamitylaser.shootEffect = Fx.none;
calamitylaser.smokeEffect = Fx.none;

const calamity = extendContent(LaserTurret, "ac-calamity",{
	generateIcons: function(){
	return [
		Core.atlas.find("advancecontent-block-7"),
		Core.atlas.find("advancecontent-ac-calamity")
	];},
	
	draw: function(tile){
		Draw.rect(Core.atlas.find("advancecontent-block-7"), tile.drawx(), tile.drawy())
	}
});
calamity.shootType = calamitylaser;
calamity.update = true;