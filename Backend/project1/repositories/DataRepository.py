from .Database import Database


class DataRepository:
    @staticmethod
    def json_or_formdata(request):
        if request.content_type == 'application/json':
            gegevens = request.get_json()
        else:
            gegevens = request.form.to_dict()
        return gegevens

    # @staticmethod
    # def read_status_lampen():
    #     sql = "SELECT * from lampen"
    #     return Database.get_rows(sql)

    # @staticmethod
    # def read_status_lamp_by_id(id):
    #     sql = "SELECT * from lampen WHERE id = %s"
    #     params = [id]
    #     return Database.get_one_row(sql, params)

    # @staticmethod
    # def update_status_lamp(id, status):
    #     sql = "UPDATE lampen SET status = %s WHERE id = %s"
    #     params = [status, id]
    #     return Database.execute_sql(sql, params)

    # @staticmethod
    # def update_status_alle_lampen(status):
    #     sql = "UPDATE lampen SET status = %s"
    #     params = [status]
    #     return Database.execute_sql(sql, params)

    # @staticmethod
    # def read_current_pulse():
    #     sql = 
    #     params = []
    #     return Database.get_one_row(sql, params)

    @staticmethod
    def measure_device(DeviceId, waarde, datetime):
        sql = "INSERT INTO meetwaarden (DeviceId, Waarde, Datum) VALUES(%s,%s,%s)"
        params = [DeviceId, waarde, datetime]
        return Database.execute_sql(sql, params)

    @staticmethod
    def get_songs(ondergrens, bovengrens):
        sql = "SELECT Titel, Id, Uitvoerder FROM HeartBeatsdb.muziek WHERE Tempo >= %s AND Tempo <= %s;"
        params = [ondergrens, bovengrens]
        return Database.get_rows(sql, params)

    @staticmethod
    def add_song_to_playlist(meetwaarde_id, songtitel, datetime):
        sql = "INSERT INTO playlist_entry (meetwaarde_id, muziek_id, datum) VALUES(%s,%s,%s)"
        params = [meetwaarde_id, songtitel, datetime]
        return Database.execute_sql(sql, params)

    @staticmethod
    def get_volgnummer():
        sql = "SELECT MAX(last_insert_id(Volgnummer)) FROM HeartBeatsdb.meetwaarden WHERE DeviceId = 'Pulse';"
        params = []
        return Database.get_rows(sql, params)

    @staticmethod
    def get_all_songs():
        sql = "SELECT * FROM muziek;"
        params = []
        return Database.get_rows(sql, params)

    @staticmethod
    def delete_song(delete_id):
        sql = "DELETE FROM HeartBeatsdb.muziek WHERE Id = %s;"
        params = [delete_id]
        return Database.execute_sql(sql, params)
    

