import { useEffect, useRef } from 'react'

const COLORS = ['#8b5cf6', '#a78bfa', '#c4b5fd', '#7c3aed', '#ddd6fe']

function rand(a, b) { return a + Math.random() * (b - a) }

class Particle {
    constructor(W, H) {
        this.reset(W, H)
    }
    reset(W, H) {
        this.x = rand(0, W)
        this.y = rand(H * 0.2, H)
        this.vy = rand(-0.5, -1.2)
        this.vx = rand(-0.2, 0.2)
        this.size = rand(1, 3)
        this.alpha = rand(0.3, 0.8)
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)]
        this.twinkle = rand(0.008, 0.025)
        this.td = 1
    }
    update(W, H) {
        this.x += this.vx; this.y += this.vy
        this.alpha += this.twinkle * this.td
        if (this.alpha > 0.85) this.td = -1
        if (this.alpha < 0.1) this.td = 1
        if (this.y < -8) this.reset(W, H)
    }
    draw(ctx) {
        ctx.save()
        ctx.globalAlpha = Math.max(0, this.alpha)
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.shadowColor = this.color
        ctx.shadowBlur = this.size * 4
        ctx.fill()
        ctx.restore()
    }
}

export default function ParticleCanvas() {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        let W, H, particles = [], rafId
        const mouse = { x: 0, y: 0 }

        function resize() {
            W = canvas.width = window.innerWidth
            H = canvas.height = window.innerHeight
        }

        function init() {
            resize()
            particles = Array.from({ length: 90 }, () => new Particle(W, H))
        }

        function tick() {
            ctx.clearRect(0, 0, W, H)
            // deep space bg
            const grad = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.7)
            grad.addColorStop(0, '#120b2e')
            grad.addColorStop(1, '#090612')
            ctx.fillStyle = grad
            ctx.fillRect(0, 0, W, H)

            // static stars
            ctx.save()
            for (let s of staticStars) {
                ctx.globalAlpha = s.a
                ctx.beginPath()
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
                ctx.fillStyle = '#fff'
                ctx.fill()
            }
            ctx.restore()

            // parallax shift
            const shiftX = (mouse.x / W - 0.5) * 12
            const shiftY = (mouse.y / H - 0.5) * 8
            ctx.save()
            ctx.translate(shiftX * 0.25, shiftY * 0.25)
            particles.forEach(p => {
                p.update(W, H);
                p.draw(ctx)
            })
            ctx.restore()

            rafId = requestAnimationFrame(tick)
        }

        let staticStars = []
        function buildStars() {
            staticStars = Array.from({ length: 120 }, () => ({
                x: rand(0, W), y: rand(0, H), r: rand(0.3, 1.2), a: rand(0.05, 0.3)
            }))
        }

        window.addEventListener('resize', () => { resize(); buildStars() })
        window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY })

        init(); buildStars(); tick()
        return () => { cancelAnimationFrame(rafId) }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            id="particle-canvas"
            style={{
                position: 'fixed', inset: 0, zIndex: 0,
                pointerEvents: 'none', display: 'block',
            }}
        />
    )
}
