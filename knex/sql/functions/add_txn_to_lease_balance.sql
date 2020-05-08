BEGIN

IF (TG_OP = 'INSERT') THEN
    
    UPDATE leases
    set balance = balance + NEW.amount
    where id = NEW.lease_id;
  
ELSIF (TG_OP = 'DELETE') THEN
  
    UPDATE leases
    set balance = balance - OLD.amount
    where id = OLD.lease_id;
  
ELSIF (TG_OP = 'UPDATE') THEN
  
    UPDATE leases
    set balance = balance - OLD.amount + NEW.amount
    where id = OLD.lease_id;
  
END IF;
  
  RETURN NULL;

END