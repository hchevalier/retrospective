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
    'reviewing',
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

--
-- Name: accounts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.accounts (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    username character varying NOT NULL,
    email character varying NOT NULL,
    password_digest character varying NOT NULL,
    password_reset_token character varying
);


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
-- Name: group_accesses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.group_accesses (
    id bigint NOT NULL,
    group_id uuid NOT NULL,
    account_id uuid NOT NULL,
    revoked_at timestamp without time zone,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: group_accesses_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.group_accesses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: group_accesses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.group_accesses_id_seq OWNED BY public.group_accesses.id;


--
-- Name: groups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.groups (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name character varying NOT NULL,
    deleted_at timestamp without time zone,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: participants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.participants (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    surname character varying NOT NULL,
    retrospective_id uuid,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    color character varying,
    logged_in boolean DEFAULT true NOT NULL,
    encryption_key character varying NOT NULL,
    account_id uuid NOT NULL
);


--
-- Name: pending_invitations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pending_invitations (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    group_id uuid NOT NULL,
    account_id uuid NOT NULL,
    retrospective_id uuid,
    email character varying NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
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
    kind public.reaction_kinds DEFAULT 'vote'::public.reaction_kinds NOT NULL,
    retrospective_id uuid NOT NULL
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
    position_in_zone integer DEFAULT 1 NOT NULL,
    position_in_topic integer DEFAULT 1 NOT NULL,
    content text NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    revealed boolean DEFAULT false NOT NULL,
    topic_id uuid
);


--
-- Name: retrospectives; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.retrospectives (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    sub_step bigint DEFAULT 0,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    kind public.retrospective_kinds NOT NULL,
    step public.retrospective_steps DEFAULT 'gathering'::public.retrospective_steps NOT NULL,
    timer_end_at timestamp without time zone,
    discussed_reflection_id uuid,
    facilitator_id uuid NOT NULL,
    revealer_id uuid,
    group_id uuid NOT NULL
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
    updated_at timestamp(6) without time zone NOT NULL,
    retrospective_id uuid
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
-- Name: group_accesses id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.group_accesses ALTER COLUMN id SET DEFAULT nextval('public.group_accesses_id_seq'::regclass);


--
-- Name: reactions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reactions ALTER COLUMN id SET DEFAULT nextval('public.reactions_id_seq'::regclass);


--
-- Name: zones id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.zones ALTER COLUMN id SET DEFAULT nextval('public.zones_id_seq'::regclass);


--
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);


--
-- Name: ar_internal_metadata ar_internal_metadata_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ar_internal_metadata
    ADD CONSTRAINT ar_internal_metadata_pkey PRIMARY KEY (key);


--
-- Name: group_accesses group_accesses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.group_accesses
    ADD CONSTRAINT group_accesses_pkey PRIMARY KEY (id);


--
-- Name: groups groups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_pkey PRIMARY KEY (id);


--
-- Name: participants participants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.participants
    ADD CONSTRAINT participants_pkey PRIMARY KEY (id);


--
-- Name: pending_invitations pending_invitations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pending_invitations
    ADD CONSTRAINT pending_invitations_pkey PRIMARY KEY (id);


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
-- Name: current_access_to_group_for_account; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX current_access_to_group_for_account ON public.group_accesses USING btree (group_id, account_id) WHERE (revoked_at IS NULL);


--
-- Name: index_accounts_on_email; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_accounts_on_email ON public.accounts USING btree (email);


--
-- Name: index_group_accesses_on_group_id_and_account_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_group_accesses_on_group_id_and_account_id ON public.group_accesses USING btree (group_id, account_id);


--
-- Name: index_participants_on_retrospective_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_participants_on_retrospective_id ON public.participants USING btree (retrospective_id);


--
-- Name: index_pending_invitations_on_group_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_pending_invitations_on_group_id ON public.pending_invitations USING btree (group_id);


--
-- Name: index_reflections_on_zone_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_reflections_on_zone_id ON public.reflections USING btree (zone_id);


--
-- Name: index_topics_on_retrospective_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_topics_on_retrospective_id ON public.topics USING btree (retrospective_id);


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
('20200420213030'),
('20200508085629'),
('20200516112029'),
('20200516113221'),
('20200516152144'),
('20200523191205'),
('20200614110955'),
('20200614130855'),
('20200614154701'),
('20200625205131'),
('20200625210311'),
('20200627114326'),
('20200627120729'),
('20200705171159'),
('20200711153629'),
('20200725200805');


