import Phaser from 'phaser';
import { SIZE, SCALE, COLOR, SOCKET_EVENTS } from '../../constants/gameConstants';
import socketService from '../../services/socketService';
import Avatar from '../prefabs/Avatar';
import BaseFlag from '../prefabs/BaseFlag';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    this.avatars    = {};
    this.baseFlags  = {};
    this.cool       = 0;
    this.frozen    = false;
  }

  create() {
    // draw background
    this.add.graphics()
      .fillStyle(0x444444, 1)
      .fillRect(0, 0, SIZE, SIZE);

    // input keys
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys    = this.input.keyboard.addKeys('W,A,S,D');
    this.passKey = this.input.keyboard.addKey('E');

    // kill/steal key (F)
    this.killKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    this.killKey.on('down', () => {
      if (!this.frozen) socketService.emit(SOCKET_EVENTS.KILL, {});    
    });

    // Listen for freeze from server
    socketService.socket.on(SOCKET_EVENTS.PLAYER_FROZEN, ({duration}) => {
      this.frozen = true;
      this.time.delayedCall(duration*1000, ()=> this.frozen=false);
    });

    // make canvas focusable for keyboard
    this.game.canvas.setAttribute('tabindex', '0');
    this.game.canvas.focus();

    this.passKey.on(
        'down',
        () => socketService.emit(SOCKET_EVENTS.PASS, {})
    )

    // expose
    window.ctfScene = this;
  }

  update(_, dt) {
    // throttle send‐rate
    this.cool += dt;
    if (this.cool < 30) return;
    this.cool = 0;

    if (this.frozen) return;   // no movement while frozen

    let dx = 0, dy = 0;
    const sp = 5;
    if (this.cursors.left.isDown  || this.keys.A.isDown) dx -= sp;
    if (this.cursors.right.isDown || this.keys.D.isDown) dx += sp;
    if (this.cursors.up.isDown    || this.keys.W.isDown) dy -= sp;
    if (this.cursors.down.isDown  || this.keys.S.isDown) dy += sp;

    if ((dx || dy)) {
      socketService.emit(SOCKET_EVENTS.MOVE, { dx, dy });
    }


  }

  ensureBaseFlag(team, x, y) {
    if (this.baseFlags[team]) return;
    this.baseFlags[team] = new BaseFlag(this, team, x, y);
  }

  hideBaseFlag(team) {
    this.baseFlags[team]?.destroy();
    delete this.baseFlags[team];
  }xx

  upsertAvatar(id, data, localId) {
    if (this.avatars[id]) {
      this.avatars[id].update(data);
    } else {
      this.avatars[id] = new Avatar(this, id, data, localId);
    }
  }

  removeAvatar(id) {
    this.avatars[id]?.destroy();
    delete this.avatars[id];
  }
}