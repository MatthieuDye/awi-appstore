CREATE TABLE public.app (
    id_app integer NOT NULL,
    name_app character varying NOT NULL,
    id_creator integer NOT NULL,
    description_app text,
    link_app character varying NOT NULL
);


ALTER TABLE public.app OWNER TO postgres;

--
-- TOC entry 197 (class 1259 OID 41211)
-- Name: app_id_app_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.app_id_app_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.app_id_app_seq OWNER TO postgres;

--
-- TOC entry 2855 (class 0 OID 0)
-- Dependencies: 197
-- Name: app_id_app_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.app_id_app_seq OWNED BY public.app.id_app;


--
-- TOC entry 200 (class 1259 OID 41229)
-- Name: label; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.label (
    id_label integer NOT NULL,
    name_label character varying NOT NULL
);


ALTER TABLE public.label OWNER TO postgres;

--
-- TOC entry 201 (class 1259 OID 41238)
-- Name: label_app; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.label_app (
    id_label integer NOT NULL,
    id_app integer NOT NULL
);


ALTER TABLE public.label_app OWNER TO postgres;

--
-- TOC entry 199 (class 1259 OID 41227)
-- Name: label_id_label_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.label_id_label_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.label_id_label_seq OWNER TO postgres;

--
-- TOC entry 2856 (class 0 OID 0)
-- Dependencies: 199
-- Name: label_id_label_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.label_id_label_seq OWNED BY public.label.id_label;


--
-- TOC entry 203 (class 1259 OID 41268)
-- Name: rank; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rank (
    id_user integer NOT NULL,
    id_app integer NOT NULL,
    rank integer NOT NULL
);


ALTER TABLE public.rank OWNER TO postgres;

--
-- TOC entry 196 (class 1259 OID 41203)
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    id_user integer NOT NULL,
    name_user character varying NOT NULL,
    mail_user character varying NOT NULL
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- TOC entry 202 (class 1259 OID 41253)
-- Name: user_app; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_app (
    id_user integer NOT NULL,
    id_app integer NOT NULL
);


ALTER TABLE public.user_app OWNER TO postgres;

--
-- TOC entry 2695 (class 2604 OID 41216)
-- Name: app id_app; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.app ALTER COLUMN id_app SET DEFAULT nextval('public.app_id_app_seq'::regclass);


--
-- TOC entry 2696 (class 2604 OID 41232)
-- Name: label id_label; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.label ALTER COLUMN id_label SET DEFAULT nextval('public.label_id_label_seq'::regclass);




--
-- TOC entry 2843 (class 0 OID 41229)
-- Dependencies: 200
-- Data for Name: label; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.label (id_label, name_label) FROM stdin;
1	sport
2	work organization
3	games
4	text editor
5	social network
\.




--
-- TOC entry 2839 (class 0 OID 41203)
-- Dependencies: 196
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (id_user, name_user, mail_user) FROM stdin;
1	williamregnart	williamregnart@gmail.com
2	marinegardeisen	marinegardeisen@gmail.com
\.


--
-- TOC entry 2845 (class 0 OID 41253)
-- Dependencies: 202
-- Data for Name: user_app; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_app (id_user, id_app) FROM stdin;
\.


--
-- TOC entry 2857 (class 0 OID 0)
-- Dependencies: 197
-- Name: app_id_app_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.app_id_app_seq', 1, true);


--
-- TOC entry 2858 (class 0 OID 0)
-- Dependencies: 199
-- Name: label_id_label_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.label_id_label_seq', 6, true);


--
-- TOC entry 2700 (class 2606 OID 41221)
-- Name: app app_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.app
    ADD CONSTRAINT app_pkey PRIMARY KEY (id_app);


--
-- TOC entry 2706 (class 2606 OID 41242)
-- Name: label_app label_app_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.label_app
    ADD CONSTRAINT label_app_pk PRIMARY KEY (id_label, id_app);


--
-- TOC entry 2704 (class 2606 OID 41237)
-- Name: label label_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.label
    ADD CONSTRAINT label_pkey PRIMARY KEY (id_label);


--
-- TOC entry 2702 (class 2606 OID 41285)
-- Name: app unique_name_app; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.app
    ADD CONSTRAINT unique_name_app UNIQUE (name_app);


--
-- TOC entry 2708 (class 2606 OID 41257)
-- Name: user_app user_app_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_app
    ADD CONSTRAINT user_app_pk PRIMARY KEY (id_user, id_app);


--
-- TOC entry 2698 (class 2606 OID 41210)
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id_user);


--
-- TOC entry 2710 (class 2606 OID 41272)
-- Name: rank user_rank_app_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rank
    ADD CONSTRAINT user_rank_app_pk PRIMARY KEY (id_user, id_app);


--
-- TOC entry 2713 (class 2606 OID 41248)
-- Name: label_app id_app_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.label_app
    ADD CONSTRAINT id_app_fk FOREIGN KEY (id_app) REFERENCES public.app(id_app);


--
-- TOC entry 2715 (class 2606 OID 41263)
-- Name: user_app id_app_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_app
    ADD CONSTRAINT id_app_fk FOREIGN KEY (id_app) REFERENCES public.app(id_app);


--
-- TOC entry 2717 (class 2606 OID 41278)
-- Name: rank id_app_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rank
    ADD CONSTRAINT id_app_fk FOREIGN KEY (id_app) REFERENCES public.app(id_app);


--
-- TOC entry 2711 (class 2606 OID 41222)
-- Name: app id_creator_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.app
    ADD CONSTRAINT id_creator_fk FOREIGN KEY (id_creator) REFERENCES public."user"(id_user);


--
-- TOC entry 2712 (class 2606 OID 41243)
-- Name: label_app id_label_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.label_app
    ADD CONSTRAINT id_label_fk FOREIGN KEY (id_label) REFERENCES public.label(id_label);


--
-- TOC entry 2714 (class 2606 OID 41258)
-- Name: user_app id_user_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_app
    ADD CONSTRAINT id_user_fk FOREIGN KEY (id_user) REFERENCES public."user"(id_user);


--
-- TOC entry 2716 (class 2606 OID 41273)
-- Name: rank id_user_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rank
    ADD CONSTRAINT id_user_fk FOREIGN KEY (id_user) REFERENCES public."user"(id_user);


-- Completed on 2019-11-05 01:41:19

--
-- PostgreSQL database dump complete
--

