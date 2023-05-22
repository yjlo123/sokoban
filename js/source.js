let sokobanSrc = `let map $in

let cm {}
put $cm 0 0  / empty: black
put $cm 1 15 / wall: dark gray
put $cm 2 13 / floor: light gray
put $cm 3 3  / crate: orange
put $cm 4 12 / target: brown
put $cm 5 2  / crate on target: yellow
put $cm 6 8  / character: cyan
put $cm 7 8  / character on target: cyan

let m {}
let cl 0 / character left
let ct 0 / character top
let target_count 0
let done_count 0

let j 0

#get_row
let i 0
let row {}
#get_cell
pol $map c
ife $c '|'
 put $m $j $row
 add j $j 1
 jmp get_row
fin
ife $c ''
 put $m $j $row
 add j $j 1
 jmp map_done
fin
ife $c '6'
 / found character
 let cl $i
 let ct $j
 let c '2' / draw floow
fin
ife $c '7'
 / found character on target
 let cl $i
 let ct $j
 let c '4' / draw target
fin
ife $c '4'
 / found target
 add target_count $target_count 1
fin
ife $c '5'
 / found crate on target
 add target_count $target_count 1
 add done_count $done_count 1
fin
put $row $i $c
add i $i 1
jmp get_cell

#map_done
ifg $i $j
 clr $i
els
 clr $j
fin

def draw
 / * draw map *
 let j 0
 #draw_row
 let i 0
 get $m $j r
 ife $r $nil
  ret
 fin
 #draw_cell
 get $r $i c
 ife $c $nil
  add j $j 1
  jmp draw_row
 fin
 get $cm $c c
 drw $i $j $c
 add i $i 1
 jmp draw_cell
end

def check_move
 let ml $0
 let mt $1
 let mml $2
 let mmt $3
 get $m $mt mr
 get $mr $ml cc
 / check move to floor
 ife $cc '2'
  let can_move 1
  ret
 fin
 / check move to target
 ife $cc '4'
  let can_move 1
  ret
 fin
 / check push crate
 jeq $cc '3' check_push
 jeq $cc '5' check_push
 let can_move 0
 ret
 #check_push
 get $m $mmt mmr
 get $mmr $mml ccc
 jeq $ccc '2' can_push
 jeq $ccc '4' can_push
 let can_move 0
 ret
 #can_push
 let can_move 1
 put $mr $ml '2'
 int ccc $ccc
 add ccc $ccc 1
 str ccc $ccc
 put $mmr $mml $ccc
 
 / check push out of target
 jne $cc '5' done_check_push_out
 jne $ccc '3' done_check_push_out
 sub done_count $done_count 1
 put $mr $ml '4'
 #done_check_push_out
 
 / check push target to target
 jne $cc '5' done_check_push_target
 jne $ccc '5' done_check_push_target
 put $mr $ml '4'
 #done_check_push_target
 
 / check push to target
 jne $ccc '5' done_check_crate
 jeq $cc $ccc done_check_crate
 add done_count $done_count 1
 int cc $cc
 sub cc $cc 1
 str cc $cc
 put $mr $ml $cc
 #done_check_crate
 ret
end

#begin

/ draw map
cal draw
/ draw character
drw $cl $ct 8

let key $lastkey
/check_left
jne $key 37 check_up
jmp press_left
jmp next
#check_up
jne $key 38 check_right
jmp press_up
jmp next
#check_right
jne $key 39 check_down
jmp press_right
jmp next
#check_down
jne $key 40 next
jmp press_down
jmp next

#press_left
sub icl $cl 1
sub iicl $cl 2
cal check_move $icl $ct $iicl $ct
ife $can_move 1
 let cl $icl
fin
jmp check_win

#press_right
add icl $cl 1
add iicl $cl 2
cal check_move $icl $ct $iicl $ct
ife $can_move 1
 let cl $icl
fin
jmp check_win

#press_up
sub ict $ct 1 
sub iict $ct 2
cal check_move $cl $ict $cl $iict
ife $can_move 1
 let ct $ict
fin
jmp check_win

#press_down
add ict $ct 1
add iict $ct 2
cal check_move $cl $ict $cl $iict
ife $can_move 1
 let ct $ict
fin
jmp check_win

#check_win
jeq $done_count $target_count win

#next
slp 30
jmp begin

#win
/ refresh result canvas
cal draw
drw $cl $ct 8
prt 'You Win!'`
