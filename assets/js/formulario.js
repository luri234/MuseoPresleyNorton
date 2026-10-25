(function () {
	const form = document.getElementById('form-contacto');
	if (!form) return;

	const estado = document.getElementById('estado-form');
	const mensaje = document.getElementById('mensaje');
	const contador = document.getElementById('contador');
	const fecha = document.getElementById('fecha');

	// La fecha de visita no puede ser anterior a hoy (hora local)
	const hoy = new Date();
	hoy.setMinutes(hoy.getMinutes() - hoy.getTimezoneOffset());
	fecha.min = hoy.toISOString().split('T')[0];

	const textos = {
		nombre: { valueMissing: 'Escribe tu nombre.', tooShort: 'Usa al menos 3 caracteres.' },
		correo: { valueMissing: 'Escribe tu correo.', typeMismatch: 'Ingresa un correo válido, como nombre@dominio.com.' },
		telefono: { patternMismatch: 'Usa solo números (9 o 10 dígitos).' },
		motivo: { valueMissing: 'Selecciona un motivo.' },
		fecha: { rangeUnderflow: 'La fecha no puede ser anterior a hoy.' },
		personas: { rangeUnderflow: 'Debe ser al menos 1.', rangeOverflow: 'El máximo es 100.', badInput: 'Ingresa un número.' },
		mensaje: { valueMissing: 'Escribe tu mensaje.', tooShort: 'Cuéntanos un poco más (mínimo 10 caracteres).' },
		acepto: { valueMissing: 'Debes aceptar para poder enviar el formulario.' }
	};

	function validarCampo(campo) {
		const salida = document.getElementById('error-' + campo.id);
		if (!salida) return true;
		let msg = '';
		if (!campo.checkValidity()) {
			const reglas = textos[campo.id] || {};
			const clave = Object.keys(reglas).find(k => campo.validity[k]);
			msg = clave ? reglas[clave] : campo.validationMessage;
		}
		salida.textContent = msg;
		campo.classList.toggle('invalido', msg !== '');
		campo.setAttribute('aria-invalid', msg !== '');
		return msg === '';
	}

	const campos = form.querySelectorAll('input:not([type="radio"]), select, textarea');

	campos.forEach(c => {
		c.addEventListener('blur', () => validarCampo(c));
		c.addEventListener('input', () => {
			if (c.classList.contains('invalido')) validarCampo(c);
		});
	});

	mensaje.addEventListener('input', () => {
		contador.textContent = mensaje.value.length + ' / 500';
	});

	form.addEventListener('submit', function (e) {
		e.preventDefault();
		let primerError = null;

		campos.forEach(c => {
			if (!validarCampo(c) && !primerError) primerError = c;
		});

		// Si prefiere respuesta por teléfono, el teléfono pasa a ser obligatorio
		const quiereTel = form.respuesta.value === 'telefono';
		const tel = document.getElementById('telefono');
		if (quiereTel && !tel.value.trim()) {
			document.getElementById('error-telefono').textContent = 'Escribe tu teléfono para responderte por esa vía.';
			tel.classList.add('invalido');
			if (!primerError) primerError = tel;
		}

		if (primerError) {
			estado.textContent = 'Revisa los campos marcados.';
			estado.classList.remove('ok');
			primerError.focus();
			return;
		}

		// Aquí iría el envío real (ver nota abajo)
		estado.textContent = '¡Gracias, ' + form.nombre.value.trim() + '! Recibimos tu mensaje.';
		estado.classList.add('ok');
		form.reset();
		contador.textContent = '0 / 500';
	});

	form.addEventListener('reset', () => {
		form.querySelectorAll('.error').forEach(s => (s.textContent = ''));
		form.querySelectorAll('.invalido').forEach(c => c.classList.remove('invalido'));
		estado.textContent = '';
		contador.textContent = '0 / 500';
	});
})();