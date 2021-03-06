s.Ship = new Class({
  extend: s.GameObject,

  options: {  
  },

  initialize: function(options) {
    var geometry = s.models[options.shipClass].geometry;
    this.materials = s.models[options.shipClass].materials[0];
    this.materials.emissive = new THREE.Color('rgb(255,255,255)');

    this.root = new THREE.Mesh(geometry, this.materials);

    // Cannon.js
    var shape = new CANNON.Sphere(100);
    var mass = 1;
    var body = this.body = new CANNON.RigidBody(mass, shape);

    // Slow down/bleed off rolling
    body.angularDamping = 0.99;
    body.linearDamping = 0.5;

    // Position body in physics simulation
    this.body.position.set(options.position.x, options.position.y, options.position.z);
    this.body.quaternion.set(options.rotation.x, options.rotation.y, options.rotation.z, options.rotation.w);

    // Position mesh in scene
    this.root.position.copy(options.position);
    this.root.quaternion.copy(options.rotation);

    this.lastTurretFire = 0;
    this.lastMissileFire = 0;
    this.alliance = options.alliance;

    this.root.name = this.name;
    this.hull = s.config.ship.hull;
    this.shields = s.config.ship.shields;

    this.lastTime = new Date().getTime();
    this.alternateFire = false;
  },

  lookAt: function(worldPosVec3) {
    // Make the mesh point at the position
    this.root.lookAt(worldPosVec3);

    // Use the mesh's quaternion to set the rotation of the body in the physics simulation
    var q = this.root.quaternion;
    this.body.quaternion.set(q.x, q.y, q.z, q.w);
  }
});
