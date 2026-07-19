document.addEventListener("DOMContentLoaded", () => {
    const inputCodigo = document.getElementById("codigo-input");
    const btnDesbloquear = document.getElementById("btn-desbloquear");
    const mensajeError = document.getElementById("mensaje-error");
    
    const pantallaInicio = document.getElementById("pantalla-inicio");
    const pantallaCorazon = document.getElementById("pantalla-corazon");

    function verificarClave() {
        const codigoIngresado = inputCodigo.value;

        if (codigoIngresado === "2021") {
            mensajeError.classList.add("oculto");
            
            const musica = document.getElementById("musica-fondo");
            musica.volume = 0.5; 
            musica.play();

            const flash = document.createElement("div");
            flash.classList.add("flash-blanco");
            document.body.appendChild(flash);

            setTimeout(() => { flash.style.opacity = "1"; }, 100);

            setTimeout(() => {
                pantallaInicio.classList.remove("active");
                pantallaInicio.classList.add("oculto");
                
                pantallaCorazon.classList.remove("oculto");
                pantallaCorazon.classList.add("active");

                document.body.style.backgroundImage = "none";
                flash.style.opacity = "0"; 
                setTimeout(() => flash.remove(), 1000);
                
                iniciarCorazon3D();

            }, 1200);
        } else {
            mensajeError.classList.remove("oculto");
            inputCodigo.value = ""; 
        }
    }

    btnDesbloquear.addEventListener("click", verificarClave);
    inputCodigo.addEventListener("keypress", (e) => {
        if (e.key === "Enter") verificarClave();
    });

    // --- CORAZÓN 3D ---
    function iniciarCorazon3D() {
        const canvas = document.getElementById('heartCanvas');
        const ctx = canvas.getContext('2d');
        let width, height;

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        const text = " I love you"; 
        const numColumns = 75; 
        const zLayers = 11; 
        const zSpacing = 0.8; 
        let time = 0;

        function animate() {
            ctx.clearRect(0, 0, width, height);
            time -= 0.008; 
            let angleY = 0.6;   
            let angleX = -0.15; 
            let projected = [];
            let size = Math.min(width, height) * 0.025; 
            let fov = 1500; 

            for (let i = 0; i < numColumns; i++) {
                let t = ((i / numColumns) * Math.PI * 2) + time;
                let x = 16 * Math.pow(Math.sin(t), 3);
                let y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
                for (let j = 0; j < zLayers; j++) {
                    let z = (j - zLayers/2) * zSpacing;
                    let char = text[j % text.length]; 
                    let y1 = y * Math.cos(angleX) - z * Math.sin(angleX);
                    let z1 = y * Math.sin(angleX) + z * Math.cos(angleX);
                    let x1 = x;
                    let x2 = x1 * Math.cos(angleY) - z1 * Math.sin(angleY);
                    let z2 = x1 * Math.sin(angleY) + z1 * Math.cos(angleY);
                    let y2 = y1;
                    let scale = fov / (fov + z2 * size);
                    let px = (x2 * size * scale) + width / 2;
                    let py = (y2 * size * scale) + height / 2;
                    projected.push({ x: px, y: py, z: z2, scale: scale, char: char });
                }
            }

            projected.sort((a, b) => b.z - a.z);
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

            for (let p of projected) {
                let depthFactor = Math.max(0, Math.min(1, (p.z + 15) / 30)); 
                let r = Math.floor(255 - (depthFactor * 100)); 
                let g = Math.floor(77 - (depthFactor * 50));
                let b = Math.floor(109 - (depthFactor * 50));
                let alpha = 1 - (depthFactor * 0.7); 
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`; 
                ctx.font = `bold ${Math.max(8, 17 * p.scale)}px monospace`;
                ctx.fillText(p.char, p.x, p.y);
            }
            requestAnimationFrame(animate);
        }
        animate();
        iniciarEstrellaMagica();
    }

    // --- ESTRELLA MÁGICA Y CHISPAS ---
    function iniciarEstrellaMagica() {
        const contenedorEstelar = document.getElementById("desbloqueo-estelar");
        const estrella = document.getElementById("estrella-viaje");
        const mensajeGirar = document.getElementById("mensaje-girar");
        let draggingEstrella = false;

        setTimeout(() => {
            const esMovil = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            if (esMovil && window.innerHeight > window.innerWidth) {
                mensajeGirar.classList.remove("oculto"); mensajeGirar.classList.add("mostrar");
                window.addEventListener("resize", function detectaHorizontal() {
                    if (window.innerWidth > window.innerHeight) {
                        window.removeEventListener("resize", detectaHorizontal);
                        mensajeGirar.classList.remove("mostrar"); mensajeGirar.classList.add("oculto");
                        contenedorEstelar.classList.remove("oculto"); contenedorEstelar.classList.add("mostrar");
                    }
                });
            } else {
                contenedorEstelar.classList.remove("oculto"); contenedorEstelar.classList.add("mostrar");
            }
        }, 4000);

        estrella.addEventListener("mousedown", () => { draggingEstrella = true; estrella.style.transition = "none"; });
        estrella.addEventListener("touchstart", () => { draggingEstrella = true; estrella.style.transition = "none"; }, {passive:false});
        window.addEventListener("mouseup", soltarEstrella);
        window.addEventListener("touchend", soltarEstrella);
        window.addEventListener("mousemove", arrastrarEstrella);
        window.addEventListener("touchmove", arrastrarEstrella, {passive:false});

        function soltarEstrella() {
            if(!draggingEstrella) return;
            draggingEstrella = false;
            estrella.style.transition = "left 0.4s ease-out"; estrella.style.left = "0px"; 
        }

        function arrastrarEstrella(e) {
            if(!draggingEstrella) return;
            if(e.type === 'touchmove') e.preventDefault();
            let clientX = e.clientX || e.touches[0].clientX;
            let clientY = e.clientY || e.touches[0].clientY;
            let rect = contenedorEstelar.getBoundingClientRect();
            let x = clientX - rect.left - 20; 
            
            if (x < 0) x = 0;
            let maxX = rect.width - 40;
            
            crearChispa(clientX, clientY); crearChispa(clientX, clientY);

            if (x >= maxX) {
                x = maxX; draggingEstrella = false; estrella.style.left = x + "px";
                window.removeEventListener("mousemove", arrastrarEstrella);
                window.removeEventListener("touchmove", arrastrarEstrella);
                setTimeout(ejecutarTransicionPantallas, 100);
            } else {
                estrella.style.left = x + "px";
            }
        }
        
        function crearChispa(x, y) {
            const chispa = document.createElement("div"); chispa.className = "chispa";
            let offsetX = x + (Math.random() * 20 - 10); let offsetY = y + (Math.random() * 20 - 10);
            chispa.style.left = offsetX + "px"; chispa.style.top = offsetY + "px";
            const angulo = Math.random() * Math.PI * 2; const distancia = Math.random() * 40 + 10; 
            const dx = Math.cos(angulo) * distancia; const dy = Math.sin(angulo) * distancia + 40; 
            chispa.style.setProperty('--dx', dx + 'px'); chispa.style.setProperty('--dy', dy + 'px');
            document.body.appendChild(chispa);
            setTimeout(() => chispa.remove(), 500); 
        }
    }

    // --- TRANSICIÓN A LA MÁQUINA DEL TIEMPO ---
    function ejecutarTransicionPantallas() {
        const p2 = document.getElementById("pantalla-corazon");
        const p3 = document.getElementById("pantalla-timeline");

        document.body.style.backgroundImage = "linear-gradient(rgba(10, 5, 20, 0.85), rgba(0, 0, 5, 0.95)), url('https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000&auto=format&fit=crop')";

        p3.classList.remove("oculto"); p3.classList.add("active");
        p3.style.transition = "none"; p3.style.transform = "translateX(-100vw)";
        void p3.offsetWidth; 
        p3.style.transition = "transform 1s cubic-bezier(0.65, 0, 0.35, 1)";
        p3.style.transform = "translateX(0)";
        p2.style.transform = "translateX(100vw)"; p2.style.opacity = "0";

        setTimeout(() => { p2.classList.remove("active"); p2.classList.add("oculto"); iniciarMotorParallax(); }, 1000);
    }

    // --- MOTOR DE TARJETAS Y CONSTELACIÓN ---
    function iniciarMotorParallax() {
        const riel = document.getElementById("riel-central");
        const orbe = document.getElementById("orbe-arrastre");
        const universo = document.getElementById("universo-escenarios");
        
       const infoMeses = [
            { titulo: "El primer encuentro", texto: "Donde comenzó nuestra historia. Fue lo mejor que me ha pasado contigo; he caminado poco a poco guiado de tu mano. Comprendí que ir con calma es lo mejor, aprecio los pequeños momentos que hemos pasado.", fotos: ["mes1.jpeg"], tipo: "normal" },
            { titulo: "Mes 2", texto: "La etapa más bella y de aprendizaje. Comencé a descubrir más de tu mundo y más me enamoraba de ti.", fotos: ["mes2.jpeg"], tipo: "normal" },
            { titulo: "Mes 3", texto: "Nuestras primeras salidas como pareja, la experiencia más bonita que tuve y quisiera seguir para más. Agradezco a Dios por juntarme contigo.", fotos: ["mes3.jpeg"], tipo: "normal" },
            { titulo: "Mes 4", texto: "Un amor que crece, donde con firmeza y sinceridad te digo: presumámonos todo lo que podamos, amémonos sin límites, sin miedos, hagamos de cuenta que somos el primer amor el uno del otro.", fotos: ["mes4.jpeg"], tipo: "normal" },
            { titulo: "Mes 5", texto: "Espero seguir teniendo nuevas aventuras a tu lado y mejorar contigo cada día como tu novio.", fotos: ["mes5.jpeg"], tipo: "normal" },
            { titulo: "Medio año", texto: "Seis meses llenos de pura magia. Toca para ver la constelación, espero que te guste lo que vamos construyendo.", fotos: ["mes6_1.jpeg", "mes6_2.jpeg", "mes6_3.jpeg", "mes6_4.jpeg"], tipo: "constelacion" },
            { titulo: "Mes 7", texto: "Casi en la recta de los 8 meses, y de mucho aprendizaje del uno para el otro. 🌟 Toca para ver nuestras estrellas.", fotos: ["foto7a.jpeg", "foto7b.jpeg", "foto7c.jpeg", "foto7d.jpeg"], tipo: "constelacion" },
            { tipo: "girasol-python" } 
        ];

        const espaciado = 65; 
        const maxScroll = 7 * espaciado; 
        
        let escenariosHTML = "";
        for (let i = 0; i < 8; i++) {
            let posVirtual = 50 + (i * espaciado); 
            
            if (infoMeses[i].tipo === "girasol-python") {
                escenariosHTML += `
                    <div class="escenario escenario-girasol" id="esc-${i}" style="left: ${posVirtual}vw;">
                        <div class="girasol-container">
                            <canvas id="girasol-canvas" width="500" height="500"></canvas>
                            <button id="btn-centro-girasol" class="centro-girasol oculto">
                                <span>Entrar </span>
                            </button>
                        </div>
                    </div>
                `;
            } else {
                let fotosHTML = "";
                if (i === 5 || i === 6) { 
                    fotosHTML = `
                        <div class="contenedor-boton-constelacion">
                            <button class="btn-constelacion" data-index="${i}">Ver Recuerdos ✨</button>
                        </div>
                    `;
                } else if (infoMeses[i].fotos.length === 1) {
                    fotosHTML = `<img src="${infoMeses[i].fotos[0]}" class="foto-sola" alt="Recuerdo">`;
                } else {
                    fotosHTML = `
                        <img src="${infoMeses[i].fotos[0]}" class="foto-mitad" alt="Recuerdo A">
                        <img src="${infoMeses[i].fotos[1]}" class="foto-mitad" alt="Recuerdo B">
                    `;
                }

                escenariosHTML += `
                    <div class="escenario" id="esc-${i}" style="left: ${posVirtual}vw;">
                        <div class="esc-numero">0${i + 1}</div>
                        <div class="esc-contenido-horizontal">
                            <div class="esc-textos">
                                <h3>${infoMeses[i].titulo}</h3>
                                <div class="esc-texto">${infoMeses[i].texto}</div>
                            </div>
                            ${(i === 5 || i === 6) ? `<div class="esc-boton-contenedor">${fotosHTML}</div>` : `<div class="esc-foto">${fotosHTML}</div>`}
                        </div>
                    </div>
                `;
            }
        }
        universo.innerHTML = escenariosHTML;

        let girasolDibujado = false;
        let isDragging = false;
        
        orbe.addEventListener("mousedown", () => isDragging = true);
        orbe.addEventListener("touchstart", () => isDragging = true, {passive: false});
        window.addEventListener("mouseup", () => isDragging = false);
        window.addEventListener("touchend", () => isDragging = false);
        window.addEventListener("mousemove", arrastrar);
        window.addEventListener("touchmove", arrastrar, {passive: false});

        function arrastrar(e) {
            if (!isDragging) return;
            if(e.type === 'touchmove') e.preventDefault();
            let clientX = e.clientX || e.touches[0].clientX;
            let rectRiel = riel.getBoundingClientRect();
            let posX = clientX - rectRiel.left;
            
            let porcentaje = (posX / rectRiel.width) * 100;
            if (porcentaje < 0) porcentaje = 0; if (porcentaje > 100) porcentaje = 100;

            orbe.style.left = `${porcentaje}%`;
            universo.style.transform = `translateX(-${(porcentaje / 100) * maxScroll}vw)`;

            const orbeTexto = orbe.querySelector('.orbe-texto');
            if (porcentaje > 88) { 
                orbe.classList.add('orbe-estrella');
                if(orbeTexto) orbeTexto.innerText = "✨"; 
            } else {
                orbe.classList.remove('orbe-estrella');
                if(orbeTexto) orbeTexto.innerText = "Tira ➔"; 
            }

            const puntosRiel = document.querySelectorAll(".punto-riel");
            for (let i = 0; i < 8; i++) {
                let umbral = (i / 7) * 100; 
                let escenario = document.getElementById(`esc-${i}`);
                if (Math.abs(porcentaje - umbral) < 6) {
                    escenario.classList.add("desbloqueado"); puntosRiel[i].classList.add("activo");
                    
                    if (i === 7 && !girasolDibujado) {
                        girasolDibujado = true;
                        dibujarGirasolPython();
                    }
                } else {
                    escenario.classList.remove("desbloqueado"); puntosRiel[i].classList.remove("activo");
                }
            }
        }
        arrastrar({ clientX: riel.getBoundingClientRect().left, type: 'mousemove' });

        const botonesConstelacion = document.querySelectorAll('.btn-constelacion');
        const pantallaConst = document.getElementById('pantalla-constelacion');
        const btnCerrarConst = document.getElementById('btn-cerrar-constelacion');

        botonesConstelacion.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                const fotos = infoMeses[index].fotos;
                
                document.getElementById('nodo-1').src = fotos[0] || '';
                document.getElementById('nodo-2').src = fotos[1] || fotos[0] || '';
                document.getElementById('nodo-3').src = fotos[2] || fotos[0] || '';
                document.getElementById('nodo-4').src = fotos[3] || fotos[1] || fotos[0] || '';

                pantallaConst.classList.remove('oculto');
                setTimeout(() => { pantallaConst.classList.add('mostrar'); }, 50); 
            });
        });

        btnCerrarConst.addEventListener('click', () => {
            pantallaConst.classList.remove('mostrar');
            setTimeout(() => {
                pantallaConst.classList.add('oculto');
                document.getElementById('nodo-1').src = ""; document.getElementById('nodo-2').src = "";
                document.getElementById('nodo-3').src = ""; document.getElementById('nodo-4').src = "";
            }, 800); 
        });
        
        // EVENTO DEL BOTÓN ENTRAR DEL GIRASOL
        const btnGirasol = document.getElementById('btn-centro-girasol');
        if (btnGirasol) {
            btnGirasol.addEventListener('click', () => {
                document.getElementById('pantalla-timeline').style.opacity = "0";
                setTimeout(() => {
                    document.getElementById('pantalla-timeline').classList.add('oculto');
                    const pantallaFinal = document.getElementById('pantalla-final');
                    pantallaFinal.classList.remove('oculto');
                    pantallaFinal.classList.add('active');
                    
                    ejecutarSorpresaTikTok();
                }, 1000);
            });
        }
    }

    // =========================================================
    // DIBUJO DEL GIRASOL EN CANVAS
    // =========================================================
    async function dibujarGirasolPython() {
        const canvas = document.getElementById('girasol-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(-Math.PI / 2); 
        ctx.lineWidth = 1.2;
        const sleep = ms => new Promise(r => setTimeout(r, ms));

        for (let i = 0; i < 16; i++) {
            ctx.save();
            let angle = i * (24 * Math.PI / 180);
            ctx.rotate(angle);
            ctx.translate(0, 40); 
            for (let j = 0; j < 18; j++) {
                let r = 150 - j * 6;
                let L = r * 1.3; 
                ctx.strokeStyle = `rgba(255, ${200 - j * 3}, 0, 0.8)`; 
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.quadraticCurveTo(L / 3.5, L / 2, 0, L);
                ctx.quadraticCurveTo(-L / 3.5, L / 2, 0, 0);
                ctx.stroke();
                await sleep(5); 
            }
            ctx.restore();
        }

        const phi = 137.508 * (Math.PI / 180);
        for (let i = 0; i < 200; i++) {
            let r = 4 * Math.sqrt(i);
            let theta = i * phi;
            let x = r * Math.cos(theta);
            let y = r * Math.sin(theta);
            ctx.fillStyle = "#3e2723"; 
            ctx.strokeStyle = "#1b0000"; 
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI); 
            ctx.fill(); ctx.stroke();
            await sleep(10); 
        }
        const btn = document.getElementById('btn-centro-girasol');
        btn.classList.remove('oculto'); btn.classList.add('mostrar-btn');
    }

    // =========================================================
    // LA SORPRESA FINAL MATRIX
    // =========================================================
    function ejecutarSorpresaTikTok() {
        const canvas = document.getElementById('matrix-canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const letras = 'HAPPYBIRTHDAY'.split('');
        const fontSize = 16;
        const columnas = canvas.width / fontSize;
        const caidas = [];
        for (let x = 0; x < columnas; x++) caidas[x] = 1;

        let matrixAnim = setInterval(() => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#ff1493'; 
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < caidas.length; i++) {
                const texto = letras[Math.floor(Math.random() * letras.length)];
                ctx.fillText(texto, i * fontSize, caidas[i] * fontSize);
                if (caidas[i] * fontSize > canvas.height && Math.random() > 0.975) caidas[i] = 0;
                caidas[i]++;
            }
        }, 33);

        const txt = document.getElementById('countdown-text');
        const btnContinuar = document.getElementById('btn-continuar-matrix');
        txt.style.opacity = 1;
        
        setTimeout(() => txt.innerText = "2", 1000);
        setTimeout(() => txt.innerText = "1", 2000);
        
        setTimeout(() => {
            txt.style.fontSize = "4.5rem"; 
            txt.innerText = "FELIZ CUMPLEAÑOS MI TEFFY";
        }, 3000);

        setTimeout(() => {
            btnContinuar.classList.remove('oculto');
            btnContinuar.classList.add('mostrar');
        }, 4500);

        // --- EL EVENTO DEL BOTÓN CONTINUAR (MENSAJE + REWIND 3D) ---
        btnContinuar.addEventListener('click', () => {
            // Desaparece el botón
            btnContinuar.classList.remove('mostrar');
            btnContinuar.classList.add('oculto');
            
            // Oculta el texto temporalmente
            txt.style.opacity = 0;

            // Muestra el mensaje personal
            setTimeout(() => {
                txt.style.fontSize = "3rem";
                txt.style.lineHeight = "1.5";
                txt.innerText = "ERES BÁSICAMENTE LO MEJOR QUE ME HA PASADO.\nPOR MÁS MOMENTOS MEMORABLES,ERES MI UNIVERSO ENTERO TQM ❤️";
                txt.style.opacity = 1;
            }, 800);

            // Transición a la Pantalla 6 (El Rewind)
            setTimeout(() => {
                document.getElementById('pantalla-final').style.opacity = 0;
                setTimeout(() => {
                    document.getElementById('pantalla-final').classList.add('oculto');
                    clearInterval(matrixAnim); // Detiene la memoria del Matrix
                    
                    const pantallaRewind = document.getElementById('pantalla-rewind');
                    pantallaRewind.classList.remove('oculto');
                    pantallaRewind.classList.add('active');
                    
                    iniciarRewind3D();
                }, 1000);
            }, 5500); // Muestra el mensaje por 4.5 segundos antes de cambiar
        });
    }

    // =========================================================
    // REWIND DE FOTOS 3D (TAMAÑO CORREGIDO)
    // =========================================================
    function iniciarRewind3D() {
        const carousel = document.getElementById('carousel-3d');
        
        // Array con absolutamente todas tus fotos del proyecto
        const todasLasFotos = [
            "mes1.jpeg", "mes2.jpeg", "mes3.jpeg", "mes4.jpeg", "mes5.jpeg", 
            "mes6_1.jpeg", "mes6_2.jpeg", "mes6_3.jpeg", "mes6_4.jpeg", 
            "foto7a.jpeg", "foto7b.jpeg", "foto7c.jpeg", "foto7d.jpeg"
        ];
        
        // Matemáticas para calcular el cilindro 3D
        let anguloRotacion = 360 / todasLasFotos.length;
        
        // CORRECCIÓN: Basado en el nuevo ancho (120px) y un margen menor
        let radioZ = Math.round((120 / 2) / Math.tan(Math.PI / todasLasFotos.length)) + 25;

        todasLasFotos.forEach((foto, i) => {
            let img = document.createElement('img');
            img.src = foto;
            // Inyecta la posición en el espacio 3D
            img.style.transform = `rotateY(${i * anguloRotacion}deg) translateZ(${radioZ}px)`;
            carousel.appendChild(img);
        });
    }
});