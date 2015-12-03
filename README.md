#JamesMoloney LinkedDataProject


###Datasets

http://www.cso.ie/px/pxeirestat/Statire/SelectVarVal/Define.asp?maintable=CD101&PLanguage=0

http://www.cso.ie/px/pxeirestat/Statire/SelectVarVal/Define.asp?maintable=NSA47&PLanguage=0

###Plan
Use both the sets to query how the sexes are paid and if they move
towards where there ae higher paying jobs are.


###API details and how to use.

returns population*
http://127.0.0.1:8000/population/

returns population*: placeName
http://127.0.0.1:8000/population/placeName/:id

//returns popuilation*: id
http://127.0.0.1:8000/population/id/:id

returns earnings*
http://127.0.0.1:8000/earnings/

returns earnings* : AreaOfResidence
http://127.0.0.1:8000/earnings/AreaOfResidence/:area'

returns earnings(area,stat,and averge): sex and area
http://127.0.0.1:8000/earnings/:sex/:area

returns earnings(sex, area, stats) : sex, area
http://127.0.0.1:8000/FemaleEarning/:area

returns earnings(sex, area, stats) : sex, area
http://127.0.0.1:8000/MaleEarning/:area

returns earnings(sex, area, stat, average): Stat, sex
http://127.0.0.1:8000/TopEarners/:sex

returns population & earnings(pop.area, earnings.area, sex, ):
http://127.0.0.1:8000/PopEarning/:sex/:province

delete population
http://127.0.0.1:8000//deletePop/:id

delete earnings
http://127.0.0.1:8000/deleteEarning/:id


###Conclusions
Using sqlite and the rdb was probably a mistake. Should have used a nosql db.
