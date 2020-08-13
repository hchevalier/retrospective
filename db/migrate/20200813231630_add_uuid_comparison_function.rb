class AddUuidComparisonFunction < ActiveRecord::Migration[6.0]
  def up
    execute <<~SQL
      CREATE FUNCTION min_uuid(uuid, uuid)
      RETURNS uuid AS $$
      BEGIN
          -- if they're both null, return null
          IF $2 IS NULL AND $1 IS NULL THEN
              RETURN NULL ;
          END IF;

          -- if just 1 is null, return the other
          IF $2 IS NULL THEN
              RETURN $1;
          END IF ;
          IF $1 IS NULL THEN
              RETURN $2;
            END IF;

          -- neither are null, return the smaller one
          IF $1 > $2 THEN
              RETURN $2;
          END IF;

          RETURN $1;
      END;
      $$ LANGUAGE plpgsql;

      create aggregate min(uuid) (
        sfunc = min_uuid,
        stype = uuid,
        combinefunc = min_uuid,
        parallel = safe,
        sortop = operator (<)
      );
    SQL
  end

  def down
    execute 'DROP FUNCTION min_uuid CASCADE'
  end
end
