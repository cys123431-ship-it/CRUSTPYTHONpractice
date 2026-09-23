/** Beginner definitions written for this course. day points to the first useful lesson. */
export type Term = {
  term: string;
  aliases?: string;
  meaning: string;
  example: string;
  day: number;
};

export const glossary: Term[] = [
  {
    term: "변수",
    aliases: "variable 이름",
    meaning:
      "값을 다시 찾아 쓰려고 붙인 이름입니다. 이름 자체와 그 이름이 가리키는 값은 다릅니다.",
    example: "minutes = 30이면 minutes는 이름, 30은 값입니다.",
    day: 1,
  },
  {
    term: "값",
    aliases: "value 데이터",
    meaning:
      "계산하거나 저장할 수 있는 실제 내용입니다. 숫자 30과 글자 '30'은 서로 다른 값입니다.",
    example: "30 + 1은 숫자 계산, '30' + '분'은 글자 이어 붙이기입니다.",
    day: 1,
  },
  {
    term: "타입",
    aliases: "자료형 type",
    meaning: "값의 종류와 그 값에 허용되는 동작을 알려 주는 분류입니다.",
    example: "정수 30에는 덧셈을, 문자열 '30'에는 글자 잇기를 할 수 있습니다.",
    day: 1,
  },
  {
    term: "바인딩",
    aliases: "binding 연결 이름",
    meaning:
      "이름을 어떤 값이나 데이터와 연결하는 일입니다. Rust의 let이 새 이름을 만듭니다.",
    example: "let minutes = 20; 은 minutes라는 이름을 값 20에 연결합니다.",
    day: 4,
  },
  {
    term: "기본 바인딩",
    aliases: "불변 바인딩 immutable let",
    meaning:
      "Rust에서 let으로 만든 이름은 기본적으로 같은 바인딩의 값을 다시 대입할 수 없습니다. 바꾸려면 mut를 붙입니다.",
    example:
      "let x = 1; x = 2; 는 오류이고 let mut x = 1; x = 2; 는 가능합니다.",
    day: 4,
  },
  {
    term: "가변",
    aliases: "mut mutable 변경 가능",
    meaning: "처음 저장한 값을 나중에 바꿀 수 있다는 뜻입니다.",
    example: "let mut n = 1; n += 1; 이면 n은 2입니다.",
    day: 4,
  },
  {
    term: "불변",
    aliases: "immutable 변경 불가",
    meaning:
      "이미 만든 데이터나 바인딩을 그대로 유지한다는 뜻입니다. 언어와 대상에 따라 범위가 다릅니다.",
    example: "Rust의 let x = 1; 뒤 같은 x 바인딩에 2를 다시 넣을 수 없습니다.",
    day: 4,
  },
  {
    term: "섀도잉",
    aliases: "shadowing 가리기",
    meaning:
      "이미 있던 이름과 같은 이름으로 새 바인딩을 만들어 앞의 이름을 가리는 일입니다.",
    example: "let x = 1; let x = x + 1; 에서 두 번째 x는 새 바인딩입니다.",
    day: 4,
  },
  {
    term: "표현식",
    aliases: "expression",
    meaning: "계산해서 하나의 값을 만드는 코드 조각입니다.",
    example: "5 * 2는 값 10을 만드는 표현식입니다.",
    day: 5,
  },
  {
    term: "형변환",
    aliases: "캐스트 cast",
    meaning:
      "값을 다른 타입으로 취급하거나 바꾸는 과정입니다. 언제 바꾸는지에 따라 결과가 달라집니다.",
    example: "C의 (double)5 / 2는 2.5입니다.",
    day: 6,
  },
  {
    term: "정수 나눗셈",
    aliases: "integer division 몫",
    meaning:
      "정수끼리 나눠 소수 부분을 버리는 계산입니다. 언어별 연산자 규칙을 확인해야 합니다.",
    example: "C의 5 / 2는 2이고 Python의 5 // 2도 2입니다.",
    day: 6,
  },
  {
    term: "f-string",
    aliases: "에프스트링 문자열 삽입 포맷팅",
    meaning:
      "Python에서 문자열 앞에 f를 붙여 중괄호 안의 값을 글자에 끼워 넣는 문법입니다.",
    example: "minutes = 30일 때 f'{minutes}분'은 '30분'입니다.",
    day: 7,
  },
  {
    term: "인수",
    aliases: "argument 인자",
    meaning: "함수를 호출할 때 실제로 전달하는 값입니다.",
    example: "add(10, 20)에서 10과 20이 인수입니다.",
    day: 20,
  },
  {
    term: "매개변수",
    aliases: "parameter",
    meaning: "함수가 입력을 받기 위해 정의할 때 붙이는 이름입니다.",
    example: "def add(a, b)에서 a와 b가 매개변수입니다.",
    day: 20,
  },
  {
    term: "반환값",
    aliases: "return result 리턴",
    meaning:
      "함수가 일을 마치고 호출한 자리로 돌려주는 값입니다. 출력과 다릅니다.",
    example: "return a + b는 합계를 호출자에게 넘깁니다.",
    day: 20,
  },
  {
    term: "지역 변수",
    aliases: "local scope 범위",
    meaning: "함수 안에서 만들고 보통 그 함수 안에서만 쓸 수 있는 이름입니다.",
    example: "함수 안의 name과 함수 밖의 name은 별개일 수 있습니다.",
    day: 23,
  },
  {
    term: "재귀",
    aliases: "recursion 자기 호출",
    meaning:
      "큰 문제를 작은 같은 문제로 바꿔 함수가 자신을 다시 호출하는 방식입니다.",
    example: "sum(3)은 3 + sum(2)로 나누고 sum(0)에서 멈춥니다.",
    day: 24,
  },
  {
    term: "기저 조건",
    aliases: "base case 종료 조건",
    meaning: "재귀가 더 이상 자신을 호출하지 않고 답을 돌려주는 경우입니다.",
    example: "n == 0이면 0을 반환해 재귀를 끝냅니다.",
    day: 24,
  },
  {
    term: "Result",
    aliases: "결과 오류 Ok Err",
    meaning:
      "Rust가 성공한 값 Ok(...)과 실패 이유 Err(...)를 구별해 돌려주는 타입입니다.",
    example:
      "'30'을 숫자로 바꾸면 Ok(30), 잘못된 글자면 Err(...)일 수 있습니다.",
    day: 25,
  },
  {
    term: "배열",
    aliases: "array",
    meaning:
      "같은 타입 값을 순서대로 담는 여러 칸입니다. C 배열은 크기와 유효한 인덱스를 확인해야 합니다.",
    example: "int a[3] = {10,20,30}; 에서 a[1]은 20입니다.",
    day: 26,
  },
  {
    term: "인덱스",
    aliases: "index 위치 번호",
    meaning:
      "순서가 있는 자료에서 몇 번째 칸인지 가리키는 번호입니다. 대부분의 예제는 0부터 셉니다.",
    example: "[10,20,30]에서 인덱스 0은 10입니다.",
    day: 26,
  },
  {
    term: "범위 밖 접근",
    aliases: "out of bounds 경계",
    meaning:
      "없는 칸을 읽거나 쓰려고 하는 일입니다. 특히 C에서는 안전을 보장받지 못합니다.",
    example: "길이 3 배열의 a[3]은 유효한 칸이 아닙니다.",
    day: 26,
  },
  {
    term: "참조",
    aliases: "reference 빌림",
    meaning:
      "이미 있는 데이터에 접근하는 경로입니다. Rust에서는 소유권을 넘기지 않고 빌려 줄 때 씁니다.",
    example: "&topic은 topic을 소유권 이동 없이 읽도록 빌려줍니다.",
    day: 29,
  },
  {
    term: "주소",
    aliases: "address 메모리 위치",
    meaning:
      "값이 놓인 메모리의 위치를 나타냅니다. 실제 숫자는 실행마다 다를 수 있습니다.",
    example: "C에서 &minutes는 minutes가 저장된 주소입니다.",
    day: 29,
  },
  {
    term: "포인터",
    aliases: "pointer 주소 변수",
    meaning:
      "다른 데이터가 있는 주소를 저장한 변수입니다. 가리키는 곳이 유효한지 확인해야 합니다.",
    example: "int *p = &n; 에서 p는 n의 주소를 담습니다.",
    day: 30,
  },
  {
    term: "역참조",
    aliases: "dereference 별표 *",
    meaning: "포인터가 가리키는 주소에 있는 실제 값을 읽거나 쓰는 동작입니다.",
    example: "int *p = &n; 일 때 *p는 n의 값입니다.",
    day: 30,
  },
  {
    term: "포인터 연산",
    aliases: "pointer arithmetic p+1",
    meaning:
      "배열 안에서 포인터를 다음 원소 위치로 이동시키는 계산입니다. 단위는 가리키는 타입 크기입니다.",
    example: "int 배열을 가리키는 p에서 p+1은 다음 int 원소의 주소입니다.",
    day: 30,
  },
  {
    term: "별칭",
    aliases: "alias 같은 객체",
    meaning: "서로 다른 이름 두 개가 같은 데이터를 가리키는 상태입니다.",
    example: "Python에서 b = a 뒤 b.append(1)하면 a에도 1이 보입니다.",
    day: 31,
  },
  {
    term: "얕은 복사",
    aliases: "shallow copy",
    meaning:
      "바깥 묶음만 새로 만들고 안에 담긴 가변 객체는 공유할 수 있는 복사입니다.",
    example: "a = [[1]]; b = a.copy(); b[0].append(2)는 a[0]에도 보입니다.",
    day: 31,
  },
  {
    term: "소유권",
    aliases: "ownership owner",
    meaning:
      "Rust가 데이터의 책임을 어느 값에 맡길지 정하는 규칙입니다. 소유자가 범위를 벗어나면 정리됩니다.",
    example: "String을 다른 변수에 이동시키면 원래 이름은 사용할 수 없습니다.",
    day: 32,
  },
  {
    term: "이동",
    aliases: "move 소유권 이동",
    meaning:
      "Rust에서 값의 소유권이 다른 변수로 넘어가는 일입니다. 타입에 따라 원래 이름을 다시 쓸 수 없습니다.",
    example: "let b = a; 뒤 String인 a를 읽으면 오류입니다.",
    day: 32,
  },
  {
    term: "복제",
    aliases: "clone 깊은 복사",
    meaning:
      "새 데이터를 만들어 원본과 독립된 소유자를 얻는 일입니다. 필요한 만큼 비용이 듭니다.",
    example: "let b = a.clone(); 뒤 두 String을 따로 쓸 수 있습니다.",
    day: 32,
  },
  {
    term: "빌림",
    aliases: "borrowing borrow",
    meaning:
      "Rust에서 데이터를 소유한 사람이 유지되는 동안 참조만 잠시 넘겨주는 일입니다.",
    example: "&topic을 함수에 넘겨 읽어도 함수 뒤 topic을 사용할 수 있습니다.",
    day: 33,
  },
  {
    term: "슬라이스",
    aliases: "slice 부분 구간",
    meaning:
      "배열이나 문자열의 일부를 빌려 보는 구간입니다. 새 데이터 전체를 복사하지 않습니다.",
    example: "[10,20,30][1..3]은 20과 30을 가리킵니다.",
    day: 36,
  },
  {
    term: "널 종료",
    aliases: "null terminator NUL \\0",
    meaning:
      "C 문자열의 끝을 알리는 값 0인 문자입니다. 눈에 보이지 않지만 저장 공간이 필요합니다.",
    example: '"cat"을 C 문자열로 저장하려면 c,a,t,\\0 네 칸이 필요합니다.',
    day: 37,
  },
  {
    term: "유니코드",
    aliases: "Unicode 문자",
    meaning:
      "여러 언어의 글자와 기호를 표현하는 문자 체계입니다. 글자 수와 바이트 수는 다릅니다.",
    example: "Python에서 len('가')는 1이고 UTF-8 바이트 길이는 3입니다.",
    day: 38,
  },
  {
    term: "힙",
    aliases: "heap memory 동적 메모리",
    meaning:
      "필요한 동안 사용할 데이터를 실행 중에 확보하는 메모리 영역입니다. C는 해제 책임이 직접 생깁니다.",
    example: "C의 malloc은 힙 공간을 요청하고 free는 사용을 끝냅니다.",
    day: 40,
  },
  {
    term: "NULL",
    aliases: "널 포인터",
    meaning:
      "C에서 유효한 객체를 가리키지 않는 특별한 포인터 값입니다. 역참조하면 안 됩니다.",
    example: "malloc 결과가 NULL이면 *p를 읽기 전에 실패를 처리합니다.",
    day: 40,
  },
  {
    term: "수명",
    aliases: "lifetime 'a 생존 범위",
    meaning:
      "Rust의 참조가 원본 데이터가 살아 있는 동안만 쓰이도록 나타내는 관계입니다.",
    example: "함수 안 지역 문자열의 참조를 함수 밖으로 돌려줄 수 없습니다.",
    day: 45,
  },
  {
    term: "구조체",
    aliases: "struct 필드",
    meaning: "관련된 값 여러 개를 이름 붙은 필드로 묶은 자료형입니다.",
    example: "Session에 topic과 minutes를 함께 저장합니다.",
    day: 50,
  },
  {
    term: "인스턴스",
    aliases: "instance 객체",
    meaning:
      "클래스나 구조체의 설계에 따라 실제로 만들어 사용 중인 한 개의 값입니다.",
    example: "Session 설계로 만든 오늘의 학습 기록 하나입니다.",
    day: 51,
  },
  {
    term: "enum",
    aliases: "열거형 상태",
    meaning: "가능한 경우를 몇 가지로 정해 각각에 이름을 붙인 타입입니다.",
    example: "Pass 또는 Fail만 허용하는 결과 상태를 만들 수 있습니다.",
    day: 53,
  },
  {
    term: "trait",
    aliases: "트레이트 능력",
    meaning:
      "Rust에서 여러 타입이 제공할 수 있는 공통 동작을 나타내는 규칙입니다.",
    example: "Display는 사용자에게 보일 글자 형식을 제공하는 능력입니다.",
    day: 54,
  },
  {
    term: "제네릭",
    aliases: "generic 타입 매개변수",
    meaning:
      "특정 타입 하나에만 묶이지 않고 여러 타입에서 같은 구조나 함수를 쓰는 방법입니다.",
    example: "T: Display라면 출력 가능한 여러 타입의 값을 받을 수 있습니다.",
    day: 54,
  },
  {
    term: "스택",
    aliases: "stack LIFO 후입선출",
    meaning: "가장 나중에 넣은 것을 가장 먼저 꺼내는 자료구조입니다.",
    example: "작업 A,B,C 뒤 취소하면 C를 먼저 되돌립니다.",
    day: 57,
  },
  {
    term: "큐",
    aliases: "queue FIFO 선입선출",
    meaning: "가장 먼저 넣은 것을 먼저 꺼내는 자료구조입니다.",
    example: "A,B,C 순으로 접수했다면 A를 먼저 처리합니다.",
    day: 59,
  },
  {
    term: "원형 큐",
    aliases: "circular queue 모듈러",
    meaning:
      "고정된 배열의 마지막 칸 뒤를 첫 칸으로 이어 쓰는 큐입니다. 가득 찬 상태를 따로 검사합니다.",
    example: "크기 3에서 2번 칸 다음은 (2+1)%3인 0번입니다.",
    day: 60,
  },
  {
    term: "연결 리스트",
    aliases: "linked list 노드 next",
    meaning: "각 항목이 다음 항목의 위치를 가리켜 순서를 잇는 자료구조입니다.",
    example: "A.next가 B를 가리키면 A에서 B로 이동할 수 있습니다.",
    day: 61,
  },
  {
    term: "불변식",
    aliases: "invariant 항상 참인 규칙",
    meaning: "코드가 실행되는 동안 특정 지점에서 계속 지켜야 하는 약속입니다.",
    example: "B.prev=A이면 A.next=B여야 양방향 연결이 맞습니다.",
    day: 62,
  },
  {
    term: "트리",
    aliases: "tree 부모 자식",
    meaning: "부모에서 자식으로 가지가 뻗는 연결 구조입니다.",
    example: "루트 A에 자식 B,C가 있다면 노드 수는 3입니다.",
    day: 64,
  },
  {
    term: "이진 탐색 트리",
    aliases: "BST binary search tree",
    meaning:
      "각 노드에서 작은 값은 왼쪽, 큰 값은 오른쪽에 두는 트리입니다. 치우치면 느릴 수 있습니다.",
    example: "뿌리 10에서 15를 찾을 때 오른쪽으로 갑니다.",
    day: 65,
  },
  {
    term: "우선순위 큐",
    aliases: "priority queue 최소 힙",
    meaning: "들어온 차례 대신 가장 우선인 항목을 먼저 꺼내는 자료구조입니다.",
    example: "최소 힙에 5,1,3을 넣으면 1을 먼저 꺼냅니다.",
    day: 66,
  },
  {
    term: "해시 맵",
    aliases: "hash map dict 사전",
    meaning: "키를 이용해 해당 값을 저장하고 찾아보는 자료구조입니다.",
    example: "counts['Python'] = 2는 Python 등장 횟수 2를 저장합니다.",
    day: 67,
  },
  {
    term: "그래프",
    aliases: "graph 정점 간선",
    meaning: "대상인 정점과 그 사이의 관계인 간선으로 만든 구조입니다.",
    example: "A에서 B로 가는 길은 A→B 간선입니다.",
    day: 68,
  },
  {
    term: "인접 목록",
    aliases: "adjacency list 이웃",
    meaning: "각 정점에서 바로 갈 수 있는 이웃들을 적은 그래프 표현입니다.",
    example: "edges['A'] = ['B','C']면 A의 이웃은 B,C입니다.",
    day: 68,
  },
  {
    term: "BFS",
    aliases: "너비 우선 탐색 breadth first search",
    meaning: "출발점에서 가까운 정점부터 큐로 차례로 방문하는 탐색입니다.",
    example: "A의 이웃 B,C를 먼저 본 뒤 그다음 층으로 갑니다.",
    day: 69,
  },
  {
    term: "DFS",
    aliases: "깊이 우선 탐색 depth first search",
    meaning:
      "한 경로를 끝까지 따라간 뒤 돌아와 다른 경로를 방문하는 탐색입니다.",
    example: "A→B→C를 따라간 뒤 돌아와 A의 다른 이웃을 봅니다.",
    day: 81,
  },
  {
    term: "시간 복잡도",
    aliases: "big O O(n) 계산량",
    meaning: "입력이 늘 때 필요한 작업 수가 얼마나 빨리 늘어나는지 나타냅니다.",
    example: "n개를 한 번씩 보면 O(n), 모든 쌍을 보면 O(n²)입니다.",
    day: 71,
  },
  {
    term: "이진 탐색",
    aliases: "binary search 반씩 줄이기",
    meaning:
      "정렬된 자료의 가운데를 보고 가능성이 없는 절반을 버리며 찾는 방법입니다.",
    example: "[10,20,30]에서 30은 가운데 20보다 크므로 오른쪽을 봅니다.",
    day: 72,
  },
  {
    term: "삽입 정렬",
    aliases: "insertion sort",
    meaning: "앞의 정렬된 부분에 다음 값을 맞는 위치로 끼워 넣는 정렬입니다.",
    example: "[3,1,2]에서 1을 3 앞에 끼운 뒤 2를 끼웁니다.",
    day: 73,
  },
  {
    term: "병합 정렬",
    aliases: "merge sort",
    meaning:
      "반으로 나눠 정렬한 뒤 두 정렬된 목록을 비교하며 합치는 방법입니다.",
    example: "[4,1]과 [3,2]를 각각 정렬해 [1,2,3,4]로 합칩니다.",
    day: 74,
  },
  {
    term: "퀵 정렬",
    aliases: "quick sort pivot 피벗",
    meaning:
      "기준 값을 골라 작은 쪽과 크거나 같은 쪽으로 나누고 각각 정렬합니다.",
    example: "피벗 3에서 [1,2] | 3 | [4]로 나눕니다.",
    day: 75,
  },
  {
    term: "분할 정복",
    aliases: "divide and conquer",
    meaning: "큰 문제를 작은 문제로 나눠 풀고 그 답을 합치는 방식입니다.",
    example: "배열 두 절반의 최댓값을 구해 둘 중 큰 값을 선택합니다.",
    day: 76,
  },
  {
    term: "그리디",
    aliases: "greedy 탐욕",
    meaning:
      "매 단계 지금 좋은 선택을 확정하는 방법입니다. 전체 정답이라는 근거나 반례 검사가 필요합니다.",
    example: "동전 4,3,1로 6을 만들 때 4+1+1보다 3+3이 적습니다.",
    day: 78,
  },
  {
    term: "동적 계획법",
    aliases: "DP dynamic programming 메모이제이션",
    meaning:
      "여러 번 필요한 작은 문제의 답을 저장해 다시 계산하지 않는 방식입니다.",
    example: "ways[n] = ways[n-1] + ways[n-2]를 작은 n부터 저장합니다.",
    day: 79,
  },
  {
    term: "백트래킹",
    aliases: "backtracking 되돌리기",
    meaning:
      "한 선택을 시험한 뒤 원래 상태로 돌려 다른 선택을 살피는 탐색입니다.",
    example:
      "path.append(x)로 고른 뒤 탐색을 마치면 path.pop()으로 되돌립니다.",
    day: 80,
  },
  {
    term: "최단 경로",
    aliases: "shortest path 다익스트라 거리 갱신",
    meaning:
      "출발점에서 목적지까지의 비용 합이 가장 작은 경로를 찾는 문제입니다.",
    example: "A→B가 5인데 A→C→B가 3이면 B의 거리 후보를 3으로 바꿉니다.",
    day: 82,
  },
  {
    term: "CSV",
    aliases: "comma separated values 쉼표 파일",
    meaning:
      "표의 한 행을 한 줄로 기록하는 파일 형식입니다. 따옴표 속 쉼표 규칙도 있어 전용 파서가 안전합니다.",
    example: "date,language,topic,minutes,result 같은 헤더를 가질 수 있습니다.",
    day: 83,
  },
  {
    term: "fixture",
    aliases: "픽스처 테스트 입력",
    meaning:
      "검사를 반복할 때 같은 결과를 기대하며 사용하는 고정된 입력 데이터입니다.",
    example: "세 언어 프로그램에 같은 CSV를 넣어 합계가 일치하는지 봅니다.",
    day: 84,
  },
  {
    term: "assert",
    aliases: "어서트 단언 테스트",
    meaning:
      "조건이 참이어야 한다고 코드에 적고 다르면 오류로 알리는 검사입니다.",
    example: "assert total == 60은 합계가 60인지 확인합니다.",
    day: 92,
  },
];
