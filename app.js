/class ElementoVisual {
    constructor(seletor) {
        this.elemento = document.querySelector(seletor);

        if (!this.elemento) {
            console.error('❌ ElementoVisual: seletor não encontrado ->', seletor);
            return;
        }

        this._estado = {
            texto: 'Elemento',
            corFundo: '#3498db',
            corTexto: '#ffffff',
            largura: 200,
            altura: 100,
            bordaRaio: 8,
            fonteTamanho: 16,
            rotacao: 0
        };

        this._estadoInicial = { ...this._estado };

        this.renderizar();
    }

    atualizarPropriedades(novasPropriedades) {
        Object.assign(this._estado, novasPropriedades);
        this.renderizar();
    }

    obterEstado() {
        return { ...this._estado };
    }

    resetar() {
        this._estado = { ...this._estadoInicial };
        this.renderizar();
    }

    renderizar() {
        if (!this.elemento) return;

        const e = this.elemento;
        const s = this._estado;

        e.textContent = s.texto;
        e.style.backgroundColor = s.corFundo;
        e.style.color = s.corTexto;
        e.style.width = s.largura + 'px';
        e.style.height = s.altura + 'px';
        e.style.borderRadius = s.bordaRaio + 'px';
        e.style.fontSize = s.fonteTamanho + 'px';
        e.style.transform = 'rotate(' + s.rotacao + 'deg)';
    }
}

class PainelControle {
    constructor(elemento) {
        this.elemento = elemento;
        this._configurarEventos();
        this._sincronizarLabels();
    }

    _configurarEventos() {
        const controles = [
            { id: 'texto',        chave: 'texto' },
            { id: 'corFundo',     chave: 'corFundo' },
            { id: 'corTexto',     chave: 'corTexto' },
            { id: 'largura',      chave: 'largura',      numero: true, label: 'valorLargura' },
            { id: 'altura',       chave: 'altura',       numero: true, label: 'valorAltura' },
            { id: 'bordaRaio',    chave: 'bordaRaio',    numero: true, label: 'valorRaio' },
            { id: 'fonteTamanho', chave: 'fonteTamanho', numero: true, label: 'valorFonte' },
            { id: 'rotacao',      chave: 'rotacao',      numero: true, label: 'valorRotacao' }
        ];

        controles.forEach((item) => {
            const input = document.getElementById(item.id);
            if (!input) return;

            input.addEventListener('input', (e) => {
                let valor = e.target.value;
                if (item.numero) valor = Number(valor);

                const dados = {};
                dados[item.chave] = valor;
                this.elemento.atualizarPropriedades(dados);

                if (item.label) {
                    const span = document.getElementById(item.label);
                    if (span) span.textContent = valor;
                }
            });
        });

        const btn = document.getElementById('btnResetar');
        if (btn) {
            btn.addEventListener('click', () => {
                this.elemento.resetar();
                this._sincronizarInputs();
            });
        }
    }

    _sincronizarInputs() {
        const estado = this.elemento.obterEstado();
        const mapa = {
            texto: 'texto',
            corFundo: 'corFundo',
            corTexto: 'corTexto',
            largura: 'largura',
            altura: 'altura',
            bordaRaio: 'bordaRaio',
            fonteTamanho: 'fonteTamanho',
            rotacao: 'rotacao'
        };

        for (const id in mapa) {
            const input = document.getElementById(id);
            if (input) input.value = estado[mapa[id]];
        }
        this._sincronizarLabels();
    }

    _sincronizarLabels() {
        const e = this.elemento.obterEstado();
        const set = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val;
        };
        set('valorLargura', e.largura);
        set('valorAltura', e.altura);
        set('valorRaio', e.bordaRaio);
        set('valorFonte', e.fonteTamanho);
        set('valorRotacao', e.rotacao);
    }
}

class Aplicacao {
    constructor() {
        console.log('🚀 Iniciando aplicação...');
        this.elemento = new ElementoVisual('#elemento');
        this.painel = new PainelControle(this.elemento);
        console.log('✅ Aplicação pronta!');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Aplicacao();
});