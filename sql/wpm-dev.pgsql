--
-- PostgreSQL database dump
--

-- Dumped from database version 12.2
-- Dumped by pg_dump version 12.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: btree_gist; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS btree_gist WITH SCHEMA public;


--
-- Name: EXTENSION btree_gist; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION btree_gist IS 'support for indexing common datatypes in GiST';


--
-- Name: citext; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA public;


--
-- Name: EXTENSION citext; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION citext IS 'data type for case-insensitive character strings';


--
-- Name: isn; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS isn WITH SCHEMA public;


--
-- Name: EXTENSION isn; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION isn IS 'data types for international product numbering standards';


--
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry, geography, and raster spatial types and functions';


--
-- Name: txn_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.txn_type AS ENUM (
    'payment',
    'rent',
    'late_fee'
);


ALTER TYPE public.txn_type OWNER TO postgres;

--
-- Name: add_txn_to_lease_balance(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.add_txn_to_lease_balance() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
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
$$;


ALTER FUNCTION public.add_txn_to_lease_balance() OWNER TO postgres;

--
-- Name: pay_balance(integer, date); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.pay_balance(lease_id integer, txn_date date) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE 
    target_balance money;
    result int;
BEGIN

    select leases.balance into target_balance from leases where leases.id = lease_id limit 1;

    if (target_balance > 0::money) then 
      insert into transactions(lease_id, txn_date, amount, type, memo)
      values (
        lease_id,
        coalesce(txn_date, now()::date),
        target_balance * -1, 
        'payment',
        'Payment of balance total'
      )
      returning transactions.id into result;
    else
      raise exception 'Lease must have a positive balance to be paid off in full';  
    end if;
    
    RETURN result;
END;
$$;


ALTER FUNCTION public.pay_balance(lease_id integer, txn_date date) OWNER TO postgres;

--
-- Name: set_current_timestamp_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.set_current_timestamp_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$;


ALTER FUNCTION public.set_current_timestamp_updated_at() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: lease_tenants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lease_tenants (
    lease_id integer NOT NULL,
    tenant_id integer NOT NULL
);


ALTER TABLE public.lease_tenants OWNER TO postgres;

--
-- Name: leases; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.leases (
    id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    rent money NOT NULL,
    balance money DEFAULT '$0.00'::money NOT NULL,
    security_deposit money DEFAULT '$0.00'::money NOT NULL,
    security_deposit_collected date,
    security_deposit_returned date,
    start_date date,
    end_date date,
    parent_id integer,
    unit_id integer NOT NULL,
    CONSTRAINT leases_check CHECK ((security_deposit_collected <= security_deposit_returned))
);


ALTER TABLE public.leases OWNER TO postgres;

--
-- Name: leases_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.leases_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.leases_id_seq OWNER TO postgres;

--
-- Name: leases_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.leases_id_seq OWNED BY public.leases.id;


--
-- Name: migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.migrations OWNER TO postgres;

--
-- Name: properties; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.properties (
    id integer NOT NULL,
    name public.citext NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT properties_name_check CHECK ((btrim((name)::text) <> ''::text))
);


ALTER TABLE public.properties OWNER TO postgres;

--
-- Name: properties_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.properties_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.properties_id_seq OWNER TO postgres;

--
-- Name: properties_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.properties_id_seq OWNED BY public.properties.id;


--
-- Name: tenants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tenants (
    id integer NOT NULL,
    first_name public.citext NOT NULL,
    middle_name public.citext,
    last_name public.citext NOT NULL,
    suffix public.citext,
    email public.citext,
    notes public.citext,
    deleted_at date,
    full_name public.citext GENERATED ALWAYS AS ((((((first_name)::text || ' '::text) || COALESCE(((middle_name)::text || ' '::text), ''::text)) || (last_name)::text) || COALESCE((' '::text || (suffix)::text), ''::text))) STORED,
    CONSTRAINT tenants_email_check CHECK ((btrim((email)::text) <> ''::text)),
    CONSTRAINT tenants_first_name_check CHECK ((btrim((first_name)::text) <> ''::text)),
    CONSTRAINT tenants_last_name_check CHECK ((btrim((last_name)::text) <> ''::text)),
    CONSTRAINT tenants_middle_name_check CHECK ((btrim((middle_name)::text) <> ''::text)),
    CONSTRAINT tenants_suffix_check CHECK ((btrim((suffix)::text) <> ''::text))
);


ALTER TABLE public.tenants OWNER TO postgres;

--
-- Name: tenants_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tenants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tenants_id_seq OWNER TO postgres;

--
-- Name: tenants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tenants_id_seq OWNED BY public.tenants.id;


--
-- Name: transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transactions (
    id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    txn_date date DEFAULT now() NOT NULL,
    amount money NOT NULL,
    memo public.citext,
    type public.txn_type NOT NULL,
    lease_id integer,
    CONSTRAINT check_txn_type_direction CHECK ((((type = 'rent'::public.txn_type) AND (amount > (0)::money)) OR ((type = 'late_fee'::public.txn_type) AND (amount > (0)::money)) OR ((type = 'payment'::public.txn_type) AND (amount < (0)::money))))
);


ALTER TABLE public.transactions OWNER TO postgres;

--
-- Name: transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.transactions_id_seq OWNER TO postgres;

--
-- Name: transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.transactions_id_seq OWNED BY public.transactions.id;


--
-- Name: units; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.units (
    id integer NOT NULL,
    name public.citext NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    property_id integer,
    CONSTRAINT units_name_check CHECK ((btrim((name)::text) <> ''::text))
);


ALTER TABLE public.units OWNER TO postgres;

--
-- Name: units_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.units_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.units_id_seq OWNER TO postgres;

--
-- Name: units_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.units_id_seq OWNED BY public.units.id;


--
-- Name: leases id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leases ALTER COLUMN id SET DEFAULT nextval('public.leases_id_seq'::regclass);


--
-- Name: properties id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.properties ALTER COLUMN id SET DEFAULT nextval('public.properties_id_seq'::regclass);


--
-- Name: tenants id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenants ALTER COLUMN id SET DEFAULT nextval('public.tenants_id_seq'::regclass);


--
-- Name: transactions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions ALTER COLUMN id SET DEFAULT nextval('public.transactions_id_seq'::regclass);


--
-- Name: units id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.units ALTER COLUMN id SET DEFAULT nextval('public.units_id_seq'::regclass);


--
-- Data for Name: lease_tenants; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lease_tenants (lease_id, tenant_id) FROM stdin;
1	1
1	2
\.


--
-- Data for Name: leases; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.leases (id, created_at, updated_at, rent, balance, security_deposit, security_deposit_collected, security_deposit_returned, start_date, end_date, parent_id, unit_id) FROM stdin;
1	2020-04-26 21:46:05.584135	2020-04-27 00:23:56.500533	$750.00	$0.00	$0.00	\N	\N	2019-08-01	2020-08-01	\N	285
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.migrations (id, name, hash, executed_at) FROM stdin;
0	create-migrations-table	e18db593bcde2aca2a408c4d1100f6abba2195df	2020-04-25 16:39:11.902205
1	create-initial-tables	71de14c19a4a144bb6e3d09f2fc4e87765c0ba39	2020-04-25 16:42:00.154017
2	more-create-tables	508ba9c716c1f71eecf071f9429685cd06a1e1e8	2020-04-25 18:52:27.676362
3	create-tables-leases-etc	654ed85d05ec847439ea4d51647b820feaa6def0	2020-04-25 19:25:13.731659
4	seed-properties	a475b85c787fa9d3724395784fcf888321af6443	2020-04-25 19:41:47.605793
5	seed-columbiana-units	25063d28a20b3a020bf6f6e5d9f8eb89f0de9973	2020-04-25 20:40:33.28099
6	seed-newton-commons-units	c0aaebfa028fc502be06aa4efe6f9bce948bc657	2020-04-25 22:05:51.86612
7	seed-newton-commons-tenants1	756b07a7b166276b64022180efcbacde886b6c84	2020-04-26 16:32:42.766706
8	alter-tenants-soft-delete-date	51c2f78642820123560634ecdf0dbc32e6570227	2020-04-26 18:04:46.106898
\.


--
-- Data for Name: properties; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.properties (id, name, created_at, updated_at) FROM stdin;
1	Columbiana Manor	2020-04-25 19:41:47.605793	2020-04-25 19:41:47.605793
2	Newton Village	2020-04-25 19:41:47.605793	2020-04-25 19:41:47.605793
3	West View Village	2020-04-25 19:41:47.605793	2020-04-25 19:41:47.605793
4	West View Village II	2020-04-25 19:41:47.605793	2020-04-25 19:41:47.605793
5	Westchester Commons	2020-04-25 19:41:47.605793	2020-04-25 19:41:47.605793
6	Newton Commons	2020-04-25 19:41:47.605793	2020-04-25 19:41:47.605793
7	Niles Executive	2020-04-25 19:41:47.605793	2020-04-25 19:41:47.605793
8	Westchester Executive	2020-04-25 19:41:47.605793	2020-04-25 19:41:47.605793
\.


--
-- Data for Name: spatial_ref_sys; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.spatial_ref_sys (srid, auth_name, auth_srid, srtext, proj4text) FROM stdin;
\.


--
-- Data for Name: tenants; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tenants (id, first_name, middle_name, last_name, suffix, email, notes, deleted_at) FROM stdin;
1	Melvin	\N	Staats	\N	\N	Newton commons, wife Myrna	\N
3	Georgia	\N	Raeburn	\N	\N	Newton commons	\N
2	Myrna	\N	Staats	\N	\N	Newton commons, husband Melvin	\N
\.


--
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transactions (id, created_at, updated_at, txn_date, amount, memo, type, lease_id) FROM stdin;
1	2020-04-26 22:52:40.605658	2020-04-26 22:52:40.605658	2020-03-01	$750.00	Rent charge for Melvin Staats Newton Commons A2 March 2020	rent	1
5	2020-04-27 00:23:56.500533	2020-04-27 00:23:56.500533	2020-04-27	-$750.00	Payment of balance total	payment	1
\.


--
-- Data for Name: units; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.units (id, name, created_at, updated_at, property_id) FROM stdin;
92	31-101	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
93	31-102	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
94	31-103	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
95	31-104	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
96	31-105	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
97	31-106	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
98	31-107	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
99	31-108	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
100	31-109	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
101	31-110	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
102	31-111	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
103	31-112	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
104	31-113	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
105	31-114	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
106	31-115	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
107	31-116	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
108	31-117	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
109	31-118	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
110	31-201	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
111	31-202	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
112	31-203	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
113	31-204	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
114	31-205	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
115	31-206	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
116	31-207	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
117	31-208	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
118	31-209	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
119	31-210	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
120	31-211	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
121	31-212	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
122	31-213	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
123	31-214	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
124	31-215	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
125	31-216	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
126	31-217	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
127	31-218	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
128	31-301	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
129	31-302	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
130	31-303	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
131	31-304	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
132	31-305	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
133	31-306	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
134	31-307	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
135	31-308	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
136	31-309	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
137	31-310	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
138	31-311	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
139	31-312	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
140	31-313	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
141	31-314	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
142	31-315	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
143	31-316	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
144	31-317	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
145	31-318	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
146	33-101	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
147	33-102	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
148	33-103	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
149	33-104	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
150	33-105	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
151	33-106	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
152	33-107	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
153	33-108	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
154	33-109	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
155	33-110	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
156	33-111	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
157	33-112	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
158	33-113	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
159	33-114	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
160	33-115	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
161	33-116	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
162	33-117	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
163	33-118	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
164	33-201	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
165	33-202	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
166	33-203	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
167	33-204	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
168	33-205	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
169	33-206	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
170	33-207	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
171	33-208	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
172	33-209	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
173	33-210	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
174	33-211	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
175	33-212	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
176	33-213	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
177	33-214	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
178	33-215	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
179	33-216	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
180	33-217	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
181	33-218	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
182	33-301	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
183	33-302	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
184	33-303	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
185	33-304	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
186	33-305	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
187	33-306	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
188	33-307	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
189	33-308	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
190	33-309	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
191	33-310	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
192	33-311	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
193	33-312	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
194	33-313	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
195	33-314	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
196	33-315	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
197	33-316	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
198	33-317	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
199	33-318	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
200	35-101	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
201	35-102	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
202	35-103	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
203	35-104	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
204	35-105	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
205	35-106	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
206	35-107	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
207	35-108	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
208	35-109	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
209	35-110	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
210	35-111	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
211	35-112	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
212	35-113	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
213	35-114	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
214	35-201	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
215	35-202	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
216	35-203	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
217	35-204	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
218	35-205	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
219	35-206	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
220	35-207	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
221	35-208	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
222	35-209	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
223	35-210	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
224	35-211	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
225	35-212	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
226	35-213	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
227	35-214	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
228	35-301	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
229	35-302	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
230	35-303	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
231	35-304	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
232	35-305	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
233	35-306	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
234	35-307	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
235	35-308	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
236	35-309	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
237	35-310	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
238	35-311	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
239	35-312	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
240	35-313	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
241	35-314	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
242	37-101	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
243	37-102	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
244	37-103	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
245	37-104	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
246	37-105	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
247	37-106	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
248	37-107	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
249	37-108	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
250	37-109	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
251	37-110	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
252	37-111	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
253	37-112	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
254	37-113	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
255	37-114	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
256	37-201	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
257	37-202	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
258	37-203	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
259	37-204	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
260	37-205	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
261	37-206	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
262	37-207	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
263	37-208	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
264	37-209	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
265	37-210	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
266	37-211	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
267	37-212	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
268	37-213	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
269	37-214	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
270	37-301	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
271	37-302	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
272	37-303	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
273	37-304	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
274	37-305	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
275	37-306	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
276	37-307	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
277	37-308	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
278	37-309	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
279	37-310	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
280	37-311	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
281	37-312	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
282	37-313	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
283	37-314	2020-04-25 20:40:33.28099	2020-04-25 20:40:33.28099	1
284	A1	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
285	A2	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
286	A3	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
287	A4	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
288	A5	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
289	A6	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
290	B1	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
291	B2	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
292	B3	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
293	B4	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
294	B5	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
295	B6	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
296	C1	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
297	C2	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
298	C3	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
299	C4	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
300	C5	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
301	C6	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
302	D1	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
303	D2	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
304	D3	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
305	D4	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
306	D5	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
307	D6	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
308	E1	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
309	E2	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
310	E3	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
311	E4	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
312	E5	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
313	E6	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
314	F1	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
315	F2	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
316	F3	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
317	F4	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
318	G1	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
319	G2	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
320	G3	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
321	G4	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
322	H1	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
323	H2	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
324	H3	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
325	H4	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
326	I1	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
327	I2	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
328	I3	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
329	I4	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
330	J1	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
331	J2	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
332	J3	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
333	J4	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
334	K1	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
335	K2	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
336	K3	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
337	K4	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
338	L1	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
339	L2	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
340	L3	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
341	L4	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
342	M1	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
343	M2	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
344	M3	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
345	M4	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
346	N1	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
347	N2	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
348	N3	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
349	N4	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
350	O1	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
351	O2	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
352	O3	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
353	O4	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
354	P1	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
355	P2	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
356	P3	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
357	P4	2020-04-25 22:05:51.86612	2020-04-25 22:05:51.86612	6
\.


--
-- Name: leases_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.leases_id_seq', 1, true);


--
-- Name: properties_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.properties_id_seq', 8, true);


--
-- Name: tenants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tenants_id_seq', 5, true);


--
-- Name: transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transactions_id_seq', 5, true);


--
-- Name: units_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.units_id_seq', 357, true);


--
-- Name: lease_tenants lease_tenants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lease_tenants
    ADD CONSTRAINT lease_tenants_pkey PRIMARY KEY (lease_id, tenant_id);


--
-- Name: leases leases_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leases
    ADD CONSTRAINT leases_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: properties properties_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.properties
    ADD CONSTRAINT properties_name_key UNIQUE (name);


--
-- Name: properties properties_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.properties
    ADD CONSTRAINT properties_pkey PRIMARY KEY (id);


--
-- Name: tenants tenants_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenants
    ADD CONSTRAINT tenants_email_key UNIQUE (email);


--
-- Name: tenants tenants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenants
    ADD CONSTRAINT tenants_pkey PRIMARY KEY (id);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- Name: units units_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.units
    ADD CONSTRAINT units_pkey PRIMARY KEY (id);


--
-- Name: units units_property_id_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.units
    ADD CONSTRAINT units_property_id_name_key UNIQUE (property_id, name);


--
-- Name: leases wpm_lease_exclude_unit_daterange; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leases
    ADD CONSTRAINT wpm_lease_exclude_unit_daterange EXCLUDE USING gist (unit_id WITH =, daterange(start_date, end_date) WITH &&);


--
-- Name: last_first_name_active_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX last_first_name_active_index ON public.tenants USING btree (last_name, first_name) WHERE (deleted_at IS NULL);


--
-- Name: unique_names_coalesce_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_names_coalesce_index ON public.tenants USING btree (first_name, COALESCE(middle_name, ''::public.citext), last_name, COALESCE(suffix, ''::public.citext));


--
-- Name: wpm_lease_parent; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX wpm_lease_parent ON public.leases USING btree (parent_id);


--
-- Name: wpm_lease_tenant_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX wpm_lease_tenant_id ON public.lease_tenants USING btree (tenant_id);


--
-- Name: wpm_lt_lease_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX wpm_lt_lease_id ON public.lease_tenants USING btree (lease_id);


--
-- Name: wpm_lt_tenant_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX wpm_lt_tenant_id ON public.lease_tenants USING btree (tenant_id);


--
-- Name: wpm_txns_lease_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX wpm_txns_lease_index ON public.transactions USING btree (lease_id);


--
-- Name: wpm_unit_property_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX wpm_unit_property_id ON public.units USING btree (property_id);


--
-- Name: wpm_unit_start_date_desc; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX wpm_unit_start_date_desc ON public.leases USING btree (unit_id, start_date DESC);


--
-- Name: transactions add_txn_to_balance; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER add_txn_to_balance AFTER INSERT OR DELETE OR UPDATE ON public.transactions FOR EACH ROW EXECUTE FUNCTION public.add_txn_to_lease_balance();


--
-- Name: leases leases_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER leases_update BEFORE UPDATE ON public.leases FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();


--
-- Name: properties propreties_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER propreties_update BEFORE UPDATE ON public.properties FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();


--
-- Name: transactions txns_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER txns_update BEFORE UPDATE ON public.transactions FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();


--
-- Name: units units_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER units_update BEFORE UPDATE ON public.units FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();


--
-- Name: lease_tenants lease_tenants_lease_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lease_tenants
    ADD CONSTRAINT lease_tenants_lease_id_fkey FOREIGN KEY (lease_id) REFERENCES public.leases(id);


--
-- Name: leases leases_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leases
    ADD CONSTRAINT leases_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.leases(id);


--
-- Name: leases leases_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leases
    ADD CONSTRAINT leases_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.units(id);


--
-- Name: transactions transactions_lease_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_lease_id_fkey FOREIGN KEY (lease_id) REFERENCES public.leases(id);


--
-- Name: units units_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.units
    ADD CONSTRAINT units_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(id);


--
-- PostgreSQL database dump complete
--

