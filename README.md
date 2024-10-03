# 65143-66043-TPC1-CGI

### 1. Tarefas a executar

Comece por atualizar a sua cópia local do repositório de CGI. Nela vai encontrar uma pasta com o código de partida para a realização do projeto, localizada em:

`projects/proj1-starting-code`

Tarefas:

1. Analise bem o código, incluindo os shaders.
2. O que faz a função `resize()`?
3. O que faz a função `get_pos_from_mouse_event()`?
4. Modifique a aplicação para que, em resposta a um evento de `mousedown`, a localização do rato seja recolhida (em coordenadas do WebGL) e acrescentada a um array.
5. Declare no vertex shader:
   * um uniform para representar o número de segmentos por curva simples
   * um vetor de uniforms do tipo vec2 com capacidade para MAX_CONTROL_POINTS, cujo valor deverá ser 256.
6. Modifique o seu programa (app.js) para enviar ao programa GLSL o número de segmentos e os pontos de controlo (os pontos forem sendo recolhidos com um click do rato)
7. Modifique o seu programa (app.js) para criar de início um buffer com 60000 entradas e cujo conteúdo deverá ser inicializado com um índice inteiro a começar em 0 e a terminar em 59999. Se os valores estiverem previamente num array javascript com o nome `xpto`, o buffer pode ser inicializado da seguinte forma: `gl.bufferData(gl.ARRAY_BUFFER, new Uint32Array(xpto), gl.STATIC_DRAW)`
8. Mude o progama (app.js) para mandar desenhar S * (P-1) + 1 pontos, onde S é o número de segmentos e P o numero de pontos introduzidos até ao momento (e guardados num array).
9. Mude o vertex shader para calcular uma posição adequada entre um par de pontos apropriado (tudo calculado a partir do índice do ponto a desenhar, do número de segmentos e do conjunto de pontos de controlo).
10. TAREFA EXTRA:
    1. "zombie mode"
    2. Todas as curvas criadas são brancas, mas no zombie mode a curva criada passa a vermelho e se tocar noutra curva essa curva, se for branca, passa a vermelho;
