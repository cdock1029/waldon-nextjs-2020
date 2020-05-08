select distinct on (l.unit_id)
u.name unit,
string_agg(t.full_name, ', ') over (partition by lt.lease_id) tenant
,l.*
from leases l
join units u on u.id=l.unit_id
join lease_tenants lt on lt.lease_id=l.id
join tenants t on t.id=lt.tenant_id
order by l.unit_id, l.start_date desc;