gsap.registerPlugin(ScrollTrigger);

const tl = gsap.timeline({ defaults: { duration: 1, ease: 'power4.out' } });

tl.from('.line span', { yPercent: 110,
     duration: 1.1,
      stagger: 0.12,
       ease: 'power4.out' })

    .from('.sub', { opacity: 0, duration: 1}, '-=0.4');

const canvas = document.getElementById('bg');
const renderer = new THREE.WebGLRenderer({canvas, alpha: true, antialias: true });
renderer.setSize(innerWidth, innerHeight, false);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 100);
camera.position.z = 7;

const shape = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(2.2, 1)),
    new THREE.LineBasicMaterial({ color: 0xb8975a, transparent: true, opacity: 0.45})
);

shape.position.x = 1.8;
shape.scale.setScalar(1.3);
scene.add(shape);

function resize() {
    renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
}
addEventListener('resize', resize);
resize();

gsap.ticker.add(() => {
    shape.rotation.y += 0.002;
    renderer.render(scene, camera);
});

gsap.to(shape.rotation, {
    z: Math.PI * 2,
    ease: 'none',
    scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1
    }
});

const st = document.getElementById('statement');
st.innerHTML = st.textContent.split('').map(w => `<span class="w">${w}</span>`).join('');

gsap.fromTo('.w', { opacity: 0.15 }, {
    opacity: 1,
    stagger: 0.1,
    ease: 'none',
    scrollTrigger: { trigger: '.about', start: 'top 65%', end: 'bottom 55%', scrub: true }
});

const projects = [
    {name: 'Chef Kitchen', text: 'A chef-inspired website with smooth GSAP animations and a warm, bold style', tags: 'JavaScript, GSAP, CSS', featured: true, link:'https://chef-kitchen-jkpl.vercel.app/'},
     {name: 'Nova Scroll', text: 'A scroll-driven page where sections glide and animate as you move down', tags: 'JavaScript, GSAP', featured: true, link: 'https://nova-scroll-weld.vercel.app' },
    {name: 'Slide Studios', text: 'A studio site built around smooth, slide-style transitions.', tags: 'JavaScript, GSAP', featured: true, link: 'https://landing-slide-show.vercel.app/' },
    {name: 'Project four', text: 'One line on what it does.', tags: 'JavaScript, GSAP', featured: true },
    {name: 'Project five', text: 'One line on what it does.', tags: 'JavaScript, GSAP', featured: false }
];

const track = document.getElementById('track');
track.innerHTML = projects.filter(p => p.featured).map(p => `
    <a class="card" href="${p.link}" target="_blank" rel="noopener">
    <div><h2>${p.name}</h2><p>${p.text}</p></div>
    <p class="tags">${p.tags}</p>
    </a>`).join('');

gsap.to(track, {
    x: () => -(track.scrollWidth - innerWidth),
    ease: 'none',
    scrollTrigger: {
        trigger: '.projects',
        start: "top top",
        end: () => '+=' + track.scrollWidth,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true
    }
});

const list = document.getElementById('list');
const filterBox = document.getElementById('filters');
const tagNames = ['All', ...new Set(projects.flatMap(p => p.tags.split(', ')))];

function render(tag) {
    const shown = tag === 'All' ? projects : projects.filter(p => p.tags.includes(tag));
    list.innerHTML = shown.map(p =>
        `<li><a href="${p.link}" target="_blank" rel="noopener">${p.name}<span>${p.tags}</span></a></li>`
    ).join('');
    filterBox.querySelectorAll('button').forEach(b =>
        b.classList.toggle('active', b.textContent === tag)
    );
}

filterBox.innerHTML = tagNames.map(t => `<button>${t}</button>`).join('');

filterBox.addEventListener('click', e => {
    if (e.target.tagName === 'BUTTON') render(e.target.textContent);
});

render('All');