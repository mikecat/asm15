'led
r1=[@dat]
r3=[r1+0]
r2=1
r2=r2<<5
r3|=r2
r0=r0+0
if !0 goto @skip
r3^=r2
@skip
[r1+0]=r3
r0=r3
ret
'data w 0 ' 無いときにアドレスがずれるバグあり
@dat
data L #50013ffc
