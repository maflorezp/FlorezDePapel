var N_FLOWERS = 80,
    PALETTE = [
        '#FF56FF', '#FFFF00',
        '#FF84FF', '#00FFFF'],
    p = ['M', 'C', ' '],
    c, ξ, w, h, flowers = [],
    m = null;

var rand = function (max, min, is_int) {
    var max = ((max - 1) || 0) + 1,
        min = min || 0,
        gen = min + (max - min) * Math.random()

    return is_int ? (~~gen) : gen;
};

var Flower = function () {
    var shape, fill, k, α, φ, f, ts,
        x, y, vx, vy, a, ax, ay, θ, ω;

    this.init = function (t, ψ) {
        var dtxt = '', cx, cy, cr, γ, x0, y0,
            n = rand(10, 5, 1),
            β = 2 * Math.PI / n,
            ri = rand(20, 5),
            ro = rand(80, 50);

        x = rand(w, 0, 1);
        y = rand(h, 0, 1);
        θ = rand(2 * Math.PI);
        ω = rand(.02 * Math.PI, .005 * Math.PI);
        vx = vy = 0;

        fill = PALETTE[rand(4, 0, 1)];
        ts = t || 0;
        φ = (ψ || ψ === 0) ? ψ : rand(Math.PI);
        f = rand(.01, .001);
        α = Math.sin(φ);

        for (var i = 0; i < n; i++) {
            for (var j = 0; j < 4; j++) {
                if (j > 0 || i + j === 0) {
                    if (i === n - 1 && j === 3) {
                        cx = x0;
                        cy = y0;
                    } else {
                        k = j % 3;
                        γ = (i + ~~(j / 2) + rand(.2, -.2)) * β;
                        cr = (k ? ro : ri) + rand(10, -5);
                        cx = ~~(cr * Math.cos(γ));
                        cy = ~~(cr * Math.sin(γ));
                    }

                    if (i + j === 0) {
                        x0 = cx;
                        y0 = cy;
                    }

                    dtxt += p[Math.min(j, 2)] + cx + ' ' + cy;
                }
            }
        }

        shape = new Path2D(dtxt);
    };

    this.update = function (t, ξ) {
        var δ, dx, dy, d;

        θ += ω;

        α = Math.sin(φ + f * (t - ts));

        if (m) {
            dx = m.x - x;
            dy = m.y - y;

            d = Math.hypot(dx, dy);
            δ = Math.atan2(dy, dx);

            a = .0001 * d;
            ax = a * Math.cos(δ);
            ay = a * Math.sin(δ);

            vx += ax;
            vy += ay;

            x += vx;
            y += vy;
        }

        if (α <= 0) {
            this.init(t, 0);
        }

        this.draw(ξ);
    };

    this.draw = function (ξ) {
        ξ.fillStyle = fill;
        ξ.globalAlpha = α;

        ξ.save();
        ξ.translate(~~x, ~~y);
        ξ.rotate(θ);

        ξ.fill(shape);
        // ξ.stroke(shape);

        ξ.restore();
    };

    this.init();
};

var size = function () {
    var s = getComputedStyle(canvas);
    canvas.width = w = ~~s.width.split('px')[0];
    canvas.height = h = ~~s.height.split('px')[0];
};

var ani = function (t) {
    ξ.clearRect(0, 0, w, h);

    for (var i = 0; i < N_FLOWERS; i++) {
        flowers[i].update(t, ξ);
    }

    requestAnimationFrame(ani.bind(this, ++t));
};

(function init() {
    canvas = document.getElementById('flowers')
    if (canvas) {
        ξ = canvas.getContext('2d');

        size();
        for (var i = 0; i < N_FLOWERS; i++) {
            flowers.push(new Flower);
        }

        ξ.strokeStyle = ξ.shadowColor =
            '#ffebbf';
        ξ.shadowBlur = 3;
        ani(0);
    }
})();

addEventListener('resize', size, false);

addEventListener('mousemove', function (e) {
    // m = {'x': e.clientX, 'y': e.clientY};
}, false);

addEventListener('mouseout', function (e) {
    // m = null;
}, false);
