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
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: reaction_kinds; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.reaction_kinds AS ENUM (
    'vote',
    'emoji'
);


--
-- Name: retrospective_kinds; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.retrospective_kinds AS ENUM (
    'kds',
    'kalm',
    'daki',
    'starfish',
    'pmi',
    'glad_sad_mad',
    'four_l',
    'sailboat',
    'truths_lie',
    'twitter',
    'timeline',
    'traffic_lights',
    'oscars_gerards',
    'star_wars',
    'day_z',
    'dixit',
    'postcard'
);


--
-- Name: retrospective_steps; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.retrospective_steps AS ENUM (
    'gathering',
    'thinking',
    'grouping',
    'voting',
    'actions',
    'done'
);


--
-- Name: task_statuses; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.task_statuses AS ENUM (
    'todo',
    'stuck',
    'done'
);


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: ar_internal_metadata; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ar_internal_metadata (
    key character varying NOT NULL,
    value character varying,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: participants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.participants (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    surname character varying NOT NULL,
    email character varying NOT NULL,
    retrospective_id uuid,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    color character varying,
    logged_in boolean DEFAULT true NOT NULL
);


--
-- Name: reactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reactions (
    id bigint NOT NULL,
    author_id uuid NOT NULL,
    target_type character varying NOT NULL,
    target_id uuid NOT NULL,
    content character varying NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    kind public.reaction_kinds DEFAULT 'vote'::public.reaction_kinds NOT NULL
);


--
-- Name: reactions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.reactions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: reactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.reactions_id_seq OWNED BY public.reactions.id;


--
-- Name: reflections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reflections (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    zone_id bigint,
    owner_id uuid NOT NULL,
    topic_id bigint,
    position_in_zone integer DEFAULT 1 NOT NULL,
    position_in_topic integer DEFAULT 1 NOT NULL,
    content text NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    revealed boolean DEFAULT false NOT NULL
);


--
-- Name: retrospectives; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.retrospectives (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name character varying NOT NULL,
    sub_step bigint DEFAULT 0,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    kind public.retrospective_kinds NOT NULL,
    step public.retrospective_steps DEFAULT 'gathering'::public.retrospective_steps NOT NULL,
    timer_end_at timestamp without time zone,
    discussed_reflection_id uuid,
    organizer_id uuid NOT NULL,
    revealer_id uuid
);


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schema_migrations (
    version character varying NOT NULL
);


--
-- Name: tasks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tasks (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    author_id uuid NOT NULL,
    assignee_id uuid NOT NULL,
    description text,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    status public.task_statuses DEFAULT 'todo'::public.task_statuses NOT NULL,
    reflection_id uuid NOT NULL
);


--
-- Name: topics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.topics (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    label character varying NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: zones; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.zones (
    id bigint NOT NULL,
    identifier character varying NOT NULL,
    retrospective_id uuid NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: zones_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.zones_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: zones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.zones_id_seq OWNED BY public.zones.id;


--
-- Name: reactions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reactions ALTER COLUMN id SET DEFAULT nextval('public.reactions_id_seq'::regclass);


--
-- Name: zones id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.zones ALTER COLUMN id SET DEFAULT nextval('public.zones_id_seq'::regclass);


--
-- Name: ar_internal_metadata ar_internal_metadata_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ar_internal_metadata
    ADD CONSTRAINT ar_internal_metadata_pkey PRIMARY KEY (key);


--
-- Name: participants participants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.participants
    ADD CONSTRAINT participants_pkey PRIMARY KEY (id);


--
-- Name: reactions reactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reactions
    ADD CONSTRAINT reactions_pkey PRIMARY KEY (id);


--
-- Name: reflections reflections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reflections
    ADD CONSTRAINT reflections_pkey PRIMARY KEY (id);


--
-- Name: retrospectives retrospectives_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.retrospectives
    ADD CONSTRAINT retrospectives_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: tasks tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (id);


--
-- Name: topics topics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.topics
    ADD CONSTRAINT topics_pkey PRIMARY KEY (id);


--
-- Name: zones zones_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_pkey PRIMARY KEY (id);


--
-- Name: index_participants_on_retrospective_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_participants_on_retrospective_id ON public.participants USING btree (retrospective_id);


--
-- Name: index_reflections_on_zone_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_reflections_on_zone_id ON public.reflections USING btree (zone_id);


--
-- Name: index_zones_on_retrospective_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_zones_on_retrospective_id ON public.zones USING btree (retrospective_id);


--
-- PostgreSQL database dump complete
--

SET search_path TO "$user", public;

INSERT INTO "schema_migrations" (version) VALUES
('20200323213216'),
('20200323213722'),
('20200324205528'),
('20200324205903'),
('20200324210000'),
('20200324210013'),
('20200324210924'),
('20200324211253'),
('20200406202903'),
('20200410201509'),
('20200411134551'),
('20200411201933'),
('20200411212511'),
('20200412084958'),
('20200412085012'),
('20200420213016'),
('20200420213030');


