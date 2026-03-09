import { useRef, useEffect } from 'react'

const rand = (min, max) => Math.random() * (max - min) + min

class Particle {
    constructor(canvasWidth, canvasHeight) {
        this.x = Math.random() * canvasWidth
        this.y = Math.random() * canvasHeight
        this.vx = rand(-0.5, 0.5)
        this.vy = rand(-0.5, 0.5)
        this.size = rand(1, 3)
        this.op = rand(0.1, 0.6)
    }

    update(canvasWidth, canvasHeight) {
        this.x += this.vx
        this.y += this.vy
        if (this.x < 0) this.x = canvasWidth
        if (this.x > canvasWidth) this.x = 0
        if (this.y < 0) this.y = canvasHeight
        if (this.y > canvasHeight) this.y = 0
    }

    draw(ctx) {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.op})`
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
    }
}

export default function ParticleCanvas() {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        let animationFrameId
        let W, H
        let particles = []

        const init = () => {
            W = window.innerWidth
            H = window.innerHeight
            canvas.width = W
            canvas.height = H
            particles = Array.from({ length: 80 }, () => new Particle(W, H))
        }

        const animate = () => {
            ctx.clearRect(0, 0, W, H)
            particles.forEach(p => {
                p.update(W, H)
                p.draw(ctx)
            })
            animationFrameId = requestAnimationFrame(animate)
        }

        init()
        animate()

        const handleResize = () => {
            init()
        }
        window.addEventListener('resize', handleResize)

        return () => {
            cancelAnimationFrame(animationFrameId)
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #1e3a6e 0%, #16306a 100%)',
                zIndex: 0,
                pointerEvents: 'none',
            }}
        />
    )
}
