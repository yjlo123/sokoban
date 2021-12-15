from collections import deque

M = {
	' ': '0', # empty
	'#': '1', # wall
	'@': '6', # player
	'$': '3', # box
	'.': '4', # goal
	'+': '7', # player on goal
	'*': '5', # box on goal
}

FILE_FORMAT_SET = {
	'slc': {
		'head': '<Level ',
		'end': '</Level>',
		'line_func': lambda l: l.strip()[3:-4],
	},
	'html': {
		'head': 'Level ',
		'end': '',
		'line_func': lambda l: l[:-1],
	}
}

def convert_to_floor(matrix, x, y):
	if matrix[x][y] == '0': # empty
		matrix[x][y] = '2' # floor

def BFS(matrix):
	n, m = len(matrix), len(matrix[0])
	x, y = 0, 0
	for i in range(n):
		for j in range(m):
			if matrix[i][j] in ('6', '7'):
				x, y = i, j
	visited = []
	for i in range(n):
		row = []
		for j in range(m):
			row.append(0)
		visited.append(row)
	
	q = deque([(x, y)])
	while q:
		a, b = q.popleft()
		visited[a][b] = 1
		if a - 1 >= 0 and matrix[a-1][b] != '1' and visited[a-1][b] != 1:
			q.append((a-1, b))
			convert_to_floor(matrix, a-1, b)
		if a + 1 < n and matrix[a+1][b] != '1'  and visited[a+1][b] != 1:
			q.append((a+1, b))
			convert_to_floor(matrix, a+1, b)
		if b - 1 > 0 and matrix[a][b-1] != '1'  and visited[a][b-1] != 1:
			q.append((a, b-1))
			convert_to_floor(matrix, a, b-1)
		if b + 1 < m and matrix[a][b+1] != '1'  and visited[a][b+1] != 1:
			q.append((a, b+1))
			convert_to_floor(matrix, a, b+1)
	
	
	
def matrix_to_code(matrix):
	rows = []
	for row in matrix:
		rows.append(''.join(row))
	return '|'.join(rows)

# handmade.slc

file_name =  'Microban.html' #'handmade.slc' # 
with open(file_name, 'r') as f:
	row = f.readline()
	file_format = file_name.split('.')[1]
	conf = FILE_FORMAT_SET[file_format]
	while row:
		if conf['head'] in row:
			width = 0
			row = f.readline()
			matrix = []
			
			while conf['end'] != row.strip():
				r = conf['line_func'](row)
				if r[0] not in M:
					# invalid row
					row = f.readline()
					continue
				if len(r) > width:
					width = len(r)
				
				matrix.append([M[i] for i in list(r)])
				row = f.readline()
			
			# normalize width
			for mr in matrix:
				if len(mr) < width:
					mr.extend(['0']*(width-len(mr)))
			BFS(matrix)
			print(matrix_to_code(matrix))
		row = f.readline()
		