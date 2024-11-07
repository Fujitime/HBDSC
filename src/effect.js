document.addEventListener("DOMContentLoaded", function() {
  const canvas = document.getElementById("canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let confetti = [];
    const confettiCount = 300;
    const gravity = 0.5;
    const terminalVelocity = 5;
    const drag = 0.075;
    const colors = [
      { front: 'red', back: 'darkred' },
      { front: 'green', back: 'darkgreen' },
      { front: 'blue', back: 'darkblue' },
      { front: 'yellow', back: 'darkyellow' },
      { front: 'orange', back: 'darkorange' },
      { front: 'pink', back: 'darkpink' },
      { front: 'purple', back: 'darkpurple' },
      { front: 'turquoise', back: 'darkturquoise' }
    ];

    const randomRange = (min, max) => Math.random() * (max - min) + min;

    // Initialize confetti particles
    const initConfetti = () => {
      confetti = Array.from({ length: confettiCount }, () => ({
        color: colors[Math.floor(randomRange(0, colors.length))],
        dimensions: { x: randomRange(10, 20), y: randomRange(10, 30) },
        position: { x: randomRange(0, canvas.width), y: canvas.height - 1 },
        rotation: randomRange(0, 2 * Math.PI),
        scale: { x: 1, y: 1 },
        velocity: { x: randomRange(-25, 25), y: randomRange(0, -50) }
      }));
    };

    // Render the confetti
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      confetti.forEach((confetto, index) => {
        const width = confetto.dimensions.x * confetto.scale.x;
        const height = confetto.dimensions.y * confetto.scale.y;

        ctx.translate(confetto.position.x, confetto.position.y);
        ctx.rotate(confetto.rotation);

        // Apply physics to confetti particles
        confetto.velocity.x -= confetto.velocity.x * drag;
        confetto.velocity.y = Math.min(confetto.velocity.y + gravity, terminalVelocity);
        confetto.velocity.x += Math.random() > 0.5 ? Math.random() : -Math.random();

        // Update position based on velocity
        confetto.position.x += confetto.velocity.x;
        confetto.position.y += confetto.velocity.y;

        // Remove confetti if it falls out of view
        if (confetto.position.y >= canvas.height) confetti.splice(index, 1);

        // Make sure confetti reappears from the other side of the screen if it goes off screen
        if (confetto.position.x > canvas.width) confetto.position.x = 0;
        if (confetto.position.x < 0) confetto.position.x = canvas.width;

        confetto.scale.y = Math.cos(confetto.position.y * 0.1);

        // Choose the color based on the scale
        ctx.fillStyle = confetto.scale.y > 0 ? confetto.color.front : confetto.color.back;

        // Draw the confetti
        ctx.fillRect(-width / 2, -height / 2, width, height);

        ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset the transform
      });

      // Continue animation if there are enough confetti particles
      if (confetti.length > 10) {
        window.requestAnimationFrame(render);
      } else {
        canvas.style.display = 'none';
        canvas.remove();
      }
    };

    // Resize canvas to match window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);

    // Set canvas dimensions on page load
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Initialize and start rendering confetti
    initConfetti();
    render();

    // Page flip function (if needed for page navigation)
    function togglePageFlip(el) {
      setAllPagesBack();
      setClickedPageForward(el);
      el.classList.toggle('turn');
    }

    function setAllPagesBack() {
      const pages = document.getElementsByClassName("page");
      for (let i = 0; i < pages.length; i++) {
        pages[i].classList.remove('z-50');
      }
    }

    function setClickedPageForward(el) {
      el.classList.add('z-50');
    }

    // Trigger birthday animation on page load
    const birthdayText = document.getElementById("birthdayText");
    setTimeout(function () {
      birthdayText.classList.add("happy-birthday");
    }, 500);
  } else {
    console.error('Canvas element not found');
  }
});
